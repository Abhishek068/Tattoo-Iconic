import logging
from django.utils import timezone
from django.conf import settings
from rest_framework import views, status, generics, permissions
from rest_framework.response import Response
from portfolio.models import PortfolioItem, SyncBatchLog, InstagramSyncRecord
from portfolio.serializers import (
    PortfolioItemDetailSerializer,
    PortfolioItemListSerializer,
    SyncBatchLogSerializer,
    PostApprovalSerializer,
)
from .services.instagram_client import InstagramClient
from .services.sync_engine import SyncEngine

logger = logging.getLogger(__name__)


class InstagramStatusView(views.APIView):
    """
    Artist Dashboard Instagram Status Hub (Phase 11 & 19)
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        client = InstagramClient()
        token_info = client.verify_token() if client.is_configured() else {"valid": False, "note": "No Meta Token configured"}

        total_imported = PortfolioItem.objects.count()
        pending_count = PortfolioItem.objects.filter(status="PENDING").count()
        published_count = PortfolioItem.objects.filter(status="PUBLISHED").count()
        failed_count = InstagramSyncRecord.objects.filter(sync_status="FAILED").count()
        hidden_count = PortfolioItem.objects.filter(status="HIDDEN").count()

        latest_batch = SyncBatchLog.objects.first()

        return Response({
            "success": True,
            "account": {
                "handle": f"@{settings.INSTAGRAM_HANDLE}",
                "artist_name": settings.ARTIST_NAME,
                "phone": settings.ARTIST_PHONE,
                "studio": settings.ARTIST_STUDIO,
                "location": settings.STUDIO_LOCATION,
                "token_status": "CONNECTED" if token_info.get("valid") else "LOCAL_CATALOG_SYNC",
                "account_type": token_info.get("account_type", "CREATOR"),
            },
            "stats": {
                "total_imported": total_imported,
                "pending_review": pending_count,
                "published_count": published_count,
                "failed_count": failed_count,
                "hidden_count": hidden_count,
                "last_sync_at": latest_batch.started_at if latest_batch else None,
                "last_sync_status": latest_batch.status if latest_batch else "READY",
            },
            "auto_publish_enabled": getattr(settings, "INSTAGRAM_AUTO_PUBLISH", False),
        })


class TriggerSyncView(views.APIView):
    """
    Trigger immediate background synchronization (Phase 4 & 18)
    Protected: Only authenticated artist
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        auto_publish = request.data.get("auto_publish", getattr(settings, "INSTAGRAM_AUTO_PUBLISH", False))
        batch_log = SyncEngine.run_live_sync(limit_pages=5, auto_publish=auto_publish)

        return Response({
            "success": True,
            "message": f"Sync batch finished with status: {batch_log.status}",
            "batch_id": str(batch_log.id),
            "total_processed": batch_log.total_processed,
            "imported": batch_log.imported_count,
            "skipped": batch_log.skipped_count,
            "failed": batch_log.failed_count,
            "synced_at": batch_log.started_at,
        })


class PendingReviewListView(generics.ListAPIView):
    """
    Pending Review Queue for Artist Approval (Phase 5 & 11)
    Protected: Only authenticated artist
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PortfolioItemDetailSerializer

    def get_queryset(self):
        return (
            PortfolioItem.objects.filter(status="PENDING")
            .select_related("style", "placement")
            .prefetch_related("media_items", "tags")
            .order_by("-imported_at")
        )


class ApprovePostView(views.APIView):
    """
    Approve single Instagram post with optional metadata edits (Phase 5 & 18)
    Protected: Only authenticated artist
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, item_id):
        item = PortfolioItem.objects.filter(id=item_id).first()
        if not item:
            return Response({"success": False, "error": "Item not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = PostApprovalSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            if data.get("title"):
                item.title = data["title"]
            if data.get("color_type"):
                item.color_type = data["color_type"]
            if "featured" in data:
                item.featured = data["featured"]
            if data.get("style_name"):
                item.style = SyncEngine.get_or_create_style(data["style_name"])
            if data.get("placement_name"):
                item.placement = SyncEngine.get_or_create_placement(data["placement_name"])

            item.status = "PUBLISHED"
            item.published = True
            item.save()

            return Response({
                "success": True,
                "message": f"Post '{item.title}' approved and published to portfolio!",
                "item_id": str(item.id),
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ApproveAllPendingView(views.APIView):
    """
    Approve all pending items at once (Phase 5 & 18)
    Protected: Only authenticated artist
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        updated = PortfolioItem.objects.filter(status="PENDING").update(
            status="PUBLISHED", published=True
        )
        return Response({
            "success": True,
            "message": f"Successfully approved {updated} pending tattoo posts!",
            "approved_count": updated,
        })


class HidePostView(views.APIView):
    """
    Hide post from public portfolio (Phase 5 & 18)
    Protected: Only authenticated artist
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, item_id):
        item = PortfolioItem.objects.filter(id=item_id).first()
        if not item:
            return Response({"success": False, "error": "Item not found"}, status=status.HTTP_404_NOT_FOUND)

        item.status = "HIDDEN"
        item.published = False
        item.save()

        return Response({
            "success": True,
            "message": f"Post '{item.title}' is now hidden from public portfolio.",
        })


class RetryFailedSyncView(views.APIView):
    """
    Retry failed imports (Phase 17 & 18)
    Protected: Only authenticated artist.
    Actually attempts re-processing of failed records.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        failed_records = InstagramSyncRecord.objects.filter(sync_status="FAILED")
        total_failed = failed_records.count()
        recovered_count = 0

        for record in failed_records:
            if record.raw_payload:
                try:
                    SyncEngine.process_single_post(record.raw_payload, auto_publish=False)
                    record.sync_status = "SUCCESS"
                    record.error_message = ""
                    record.last_synced_at = timezone.now()
                    record.save()
                    recovered_count += 1
                except Exception as e:
                    record.error_message = str(e)
                    record.save()
                    logger.warning("Retry failed for record %s: %s", record.instagram_id, e)

        return Response({
            "success": True,
            "message": f"Processed {total_failed} failed records. {recovered_count} successfully imported.",
            "total_retried": total_failed,
            "recovered_count": recovered_count,
        })


class SyncHistoryListView(generics.ListAPIView):
    """
    Sync Audit Log History (Phase 12)
    Protected: Only authenticated artist
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = SyncBatchLogSerializer
    queryset = SyncBatchLog.objects.all().order_by("-started_at")[:50]


class ImportJsonArchiveView(views.APIView):
    """
    Bulk Import from Instagram JSON / ZIP Data Export (Phase 2)
    Protected: Only authenticated artist
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        file_obj = request.FILES.get("file")
        raw_json = request.data.get("json_content")

        content = ""
        if file_obj:
            content = file_obj.read().decode("utf-8")
        elif raw_json:
            content = raw_json
        else:
            return Response(
                {"success": False, "error": "Please provide a JSON file or json_content body."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            res = SyncEngine.import_from_json_archive(content)
            return Response(res)
        except Exception as e:
            logger.error("Error in JSON archive upload: %s", e)
            return Response({"success": False, "error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
