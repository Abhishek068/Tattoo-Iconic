import logging
import json
from datetime import datetime
from django.utils import timezone
from django.conf import settings
from portfolio.models import (
    PortfolioItem,
    PortfolioMedia,
    InstagramSyncRecord,
    SyncBatchLog,
    TattooStyle,
    Placement,
    Tag,
)
from .instagram_client import InstagramClient
from .ai_classifier import AIClassifier

logger = logging.getLogger(__name__)

class SyncEngine:
    """
    Core Instagram Synchronization & Ingestion Engine (Phases 2, 4, 12, 13, 14, 18)
    Handles API pagination, duplicate prevention, AI tagging, approval workflows, and audit logging.
    """

    @classmethod
    def get_or_create_style(cls, style_name: str) -> TattooStyle:
        style, _ = TattooStyle.objects.get_or_create(
            name=style_name,
            defaults={"description": f"Master {style_name} tattoo works by Jainik Patel"},
        )
        return style

    @classmethod
    def get_or_create_placement(cls, placement_name: str) -> Placement:
        placement, _ = Placement.objects.get_or_create(name=placement_name)
        return placement

    @classmethod
    def process_single_post(cls, post_data: dict, auto_publish: bool = None) -> tuple[PortfolioItem, str]:
        """
        Process a single Instagram post payload (from API, Scraper, or Data Export JSON).
        Returns (PortfolioItem, action: 'CREATED' | 'UPDATED' | 'SKIPPED' | 'FAILED')
        """
        media_id = str(post_data.get("id") or post_data.get("media_id") or post_data.get("shortcode") or "")
        if not media_id:
            raise ValueError("Post missing unique Instagram media id")

        caption = post_data.get("caption") or ""
        media_type = post_data.get("media_type") or ("VIDEO" if post_data.get("is_reel") else "IMAGE")
        permalink = post_data.get("permalink") or f"https://www.instagram.com/{settings.INSTAGRAM_HANDLE}"
        media_url = post_data.get("media_url") or post_data.get("image") or ""
        thumbnail_url = post_data.get("thumbnail_url") or media_url

        # Parse timestamp
        raw_time = post_data.get("timestamp") or post_data.get("published_at")
        published_at = None
        if raw_time:
            if isinstance(raw_time, (int, float)):
                published_at = datetime.fromtimestamp(raw_time, tz=timezone.utc)
            elif isinstance(raw_time, str):
                try:
                    published_at = datetime.fromisoformat(raw_time.replace("Z", "+00:00"))
                except ValueError:
                    published_at = timezone.now()
        if not published_at:
            published_at = timezone.now()

        like_count = int(post_data.get("like_count") or post_data.get("likes") or 0)
        comments_count = int(post_data.get("comments_count") or post_data.get("comments") or 0)

        # Run AI Classification Suggestions
        ai_res = AIClassifier.classify(caption, media_type)
        style_obj = cls.get_or_create_style(ai_res["suggested_style"])
        placement_obj = cls.get_or_create_placement(ai_res["suggested_placement"])

        # Decide initial status (Phase 5 & 18)
        if auto_publish is None:
            auto_publish = getattr(settings, "INSTAGRAM_AUTO_PUBLISH", False)

        initial_status = "PUBLISHED" if auto_publish else "PENDING"
        is_published = auto_publish

        # Duplicate Check (Phase 13)
        existing_item = PortfolioItem.objects.filter(instagram_media_id=media_id).first()
        if existing_item:
            # Update engagement metrics & timestamps if changed
            existing_item.like_count = max(existing_item.like_count, like_count)
            existing_item.comments_count = max(existing_item.comments_count, comments_count)
            if not existing_item.description:
                existing_item.description = caption
            existing_item.save()

            InstagramSyncRecord.objects.update_or_create(
                instagram_media_id=media_id,
                defaults={
                    "sync_status": "SUCCESS",
                    "source_updated_at": published_at,
                    "error_message": "",
                },
            )
            return existing_item, "UPDATED"

        # Create New Portfolio Item
        title = post_data.get("title") or ai_res["suggested_title"]
        item = PortfolioItem.objects.create(
            instagram_media_id=media_id,
            instagram_permalink=permalink,
            title=title,
            caption=caption,
            description=caption,
            media_type=media_type,
            published_at=published_at,
            style=style_obj,
            placement=placement_obj,
            color_type=ai_res["suggested_color"],
            featured=like_count > 4000,
            published=is_published,
            status=initial_status,
            ai_suggested_style=ai_res["suggested_style"],
            ai_suggested_placement=ai_res["suggested_placement"],
            ai_suggested_tags=", ".join(ai_res["suggested_tags"]),
            ai_confidence_score=ai_res["confidence_score"],
            like_count=like_count,
            comments_count=comments_count,
        )

        # Attach Tags
        for tag_name in ai_res["suggested_tags"]:
            tag_obj, _ = Tag.objects.get_or_create(name=tag_name)
            item.tags.add(tag_obj)

        # Create Portfolio Media
        PortfolioMedia.objects.create(
            portfolio_item=item,
            media_type="VIDEO" if media_type == "VIDEO" else "IMAGE",
            source_url=media_url,
            storage_url=media_url,
            thumbnail_url=thumbnail_url,
            display_order=0,
        )

        # Handle Carousel Children if present
        children = post_data.get("children", {}).get("data", [])
        if isinstance(children, list) and len(children) > 1:
            for idx, child in enumerate(children[1:], start=1):
                c_url = child.get("media_url") or child.get("thumbnail_url")
                if c_url:
                    PortfolioMedia.objects.create(
                        portfolio_item=item,
                        media_type=child.get("media_type", "IMAGE"),
                        source_url=c_url,
                        storage_url=c_url,
                        thumbnail_url=child.get("thumbnail_url", c_url),
                        display_order=idx,
                    )

        # Record Sync Status
        InstagramSyncRecord.objects.update_or_create(
            instagram_media_id=media_id,
            defaults={
                "sync_status": "SUCCESS",
                "source_updated_at": published_at,
                "error_message": "",
            },
        )

        return item, "CREATED"

    @classmethod
    def run_live_sync(cls, limit_pages: int = 10, auto_publish: bool = None) -> SyncBatchLog:
        """
        Execute live synchronisation with Meta Graph API across paginated pages (Phase 2 & 4).
        """
        batch_log = SyncBatchLog.objects.create(
            status="IN_PROGRESS",
            log_details={"source": "meta_graph_api", "handle": settings.INSTAGRAM_HANDLE},
        )

        client = InstagramClient()
        if not client.is_configured():
            batch_log.status = "PARTIAL"
            batch_log.completed_at = timezone.now()
            batch_log.log_details["warning"] = "API token not configured, checking local synchronized catalog."
            batch_log.save()
            return batch_log

        total_processed = 0
        imported_count = 0
        skipped_count = 0
        failed_count = 0
        cursor = None
        pages_fetched = 0

        try:
            while pages_fetched < limit_pages:
                page_res = client.fetch_media_page(limit=50, after=cursor)
                if not page_res.get("success"):
                    batch_log.log_details["error"] = page_res.get("error")
                    break

                items = page_res.get("data", [])
                if not items:
                    break

                for post_data in items:
                    total_processed += 1
                    try:
                        _, action = cls.process_single_post(post_data, auto_publish=auto_publish)
                        if action == "CREATED":
                            imported_count += 1
                        else:
                            skipped_count += 1
                    except Exception as e:
                        failed_count += 1
                        logger.error("Failed importing IG post %s: %s", post_data.get("id"), e)

                cursor = page_res.get("next_cursor")
                pages_fetched += 1
                if not page_res.get("has_next") or not cursor:
                    break

            batch_log.status = "COMPLETED" if failed_count == 0 else "PARTIAL"
        except Exception as e:
            batch_log.status = "FAILED"
            batch_log.log_details["fatal_error"] = str(e)
            logger.exception("Sync engine error during live batch: %s", e)
        finally:
            batch_log.completed_at = timezone.now()
            batch_log.total_processed = total_processed
            batch_log.imported_count = imported_count
            batch_log.skipped_count = skipped_count
            batch_log.failed_count = failed_count
            batch_log.save()

        return batch_log

    @classmethod
    def import_from_json_archive(cls, file_content: str, auto_publish: bool = None) -> dict:
        """
        Bulk Import from Instagram Official Data Export JSON (Phase 2).
        Supports posts_1.json, content_export.json, or custom JSON archives.
        """
        data = json.loads(file_content)
        posts_list = []

        if isinstance(data, list):
            posts_list = data
        elif isinstance(data, dict):
            # Instagram JSON export formats
            if "ig_posts" in data:
                posts_list = data["ig_posts"]
            elif "media" in data:
                posts_list = data["media"]
            elif "posts" in data:
                posts_list = data["posts"]
            else:
                posts_list = [data]

        imported = 0
        skipped = 0
        failed = 0

        for post in posts_list:
            try:
                # Normalize Instagram Data Export format
                normalized = {
                    "id": post.get("id") or post.get("pk") or f"ig-archive-{hash(post.get('media_url', '') + str(post.get('timestamp', '')))}",
                    "caption": post.get("caption") or post.get("title", ""),
                    "media_type": post.get("media_type") or "IMAGE",
                    "media_url": post.get("media_url") or post.get("uri") or post.get("image", ""),
                    "thumbnail_url": post.get("thumbnail_url") or post.get("media_url") or "",
                    "permalink": post.get("permalink") or f"https://www.instagram.com/{settings.INSTAGRAM_HANDLE}",
                    "timestamp": post.get("timestamp") or post.get("published_at"),
                    "like_count": post.get("like_count", 0),
                    "comments_count": post.get("comments_count", 0),
                }

                if not normalized["media_url"]:
                    continue

                _, action = cls.process_single_post(normalized, auto_publish=auto_publish)
                if action == "CREATED":
                    imported += 1
                else:
                    skipped += 1
            except Exception as e:
                failed += 1
                logger.error("Error importing archive item: %s", e)

        return {
            "success": True,
            "total_records": len(posts_list),
            "imported": imported,
            "skipped": skipped,
            "failed": failed,
        }
