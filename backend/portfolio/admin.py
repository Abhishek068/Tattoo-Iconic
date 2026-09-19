from django.contrib import admin
from .models import (
    TattooStyle,
    Placement,
    Tag,
    PortfolioItem,
    PortfolioMedia,
    InstagramSyncRecord,
    SyncBatchLog,
)

class PortfolioMediaInline(admin.TabularInline):
    model = PortfolioMedia
    extra = 1

@admin.register(PortfolioItem)
class PortfolioItemAdmin(admin.ModelAdmin):
    list_display = [
        "title",
        "style",
        "placement",
        "color_type",
        "status",
        "featured",
        "published",
        "published_at",
        "like_count",
    ]
    list_filter = ["status", "published", "featured", "style", "placement", "color_type"]
    search_fields = ["title", "caption", "description", "instagram_media_id"]
    inlines = [PortfolioMediaInline]
    date_hierarchy = "published_at"

@admin.register(TattooStyle)
class TattooStyleAdmin(admin.ModelAdmin):
    list_display = ["name", "slug", "active"]
    search_fields = ["name"]

@admin.register(Placement)
class PlacementAdmin(admin.ModelAdmin):
    list_display = ["name", "slug"]
    search_fields = ["name"]

@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ["name", "slug"]
    search_fields = ["name"]

@admin.register(InstagramSyncRecord)
class InstagramSyncRecordAdmin(admin.ModelAdmin):
    list_display = ["instagram_media_id", "sync_status", "last_synced_at", "source_updated_at"]
    list_filter = ["sync_status"]
    search_fields = ["instagram_media_id", "error_message"]

@admin.register(SyncBatchLog)
class SyncBatchLogAdmin(admin.ModelAdmin):
    list_display = [
        "started_at",
        "completed_at",
        "status",
        "total_processed",
        "imported_count",
        "skipped_count",
        "failed_count",
    ]
    list_filter = ["status"]
