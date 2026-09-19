from rest_framework import serializers
from .models import (
    TattooStyle,
    Placement,
    Tag,
    PortfolioItem,
    PortfolioMedia,
    InstagramSyncRecord,
    SyncBatchLog,
)

class TattooStyleSerializer(serializers.ModelSerializer):
    class Meta:
        model = TattooStyle
        fields = ["id", "name", "slug", "description", "active"]


class PlacementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Placement
        fields = ["id", "name", "slug"]


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ["id", "name", "slug"]


class PortfolioMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = PortfolioMedia
        fields = [
            "id",
            "media_type",
            "source_url",
            "storage_url",
            "thumbnail_url",
            "width",
            "height",
            "duration",
            "display_order",
        ]


class PortfolioItemListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for high-performance paginated grid (Phase 8 & 16)
    """
    style_name = serializers.CharField(source="style.name", read_only=True)
    placement_name = serializers.CharField(source="placement.name", read_only=True)
    primary_image = serializers.SerializerMethodField()
    tags_list = serializers.SlugRelatedField(source="tags", many=True, read_only=True, slug_field="name")

    class Meta:
        model = PortfolioItem
        fields = [
            "id",
            "instagram_media_id",
            "instagram_permalink",
            "title",
            "caption",
            "media_type",
            "published_at",
            "style_name",
            "placement_name",
            "color_type",
            "session_hours",
            "featured",
            "published",
            "status",
            "like_count",
            "comments_count",
            "primary_image",
            "tags_list",
        ]

    def get_primary_image(self, obj) -> str:
        first_media = obj.media_items.first()
        if first_media:
            return first_media.storage_url or first_media.source_url
        return ""


class PortfolioItemDetailSerializer(serializers.ModelSerializer):
    """
    Full detail serializer for cinematic modal view (Phase 9 & 19)
    """
    style = TattooStyleSerializer(read_only=True)
    placement = PlacementSerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    media_items = PortfolioMediaSerializer(many=True, read_only=True)
    whatsapp_booking_url = serializers.SerializerMethodField()

    class Meta:
        model = PortfolioItem
        fields = [
            "id",
            "instagram_media_id",
            "instagram_permalink",
            "title",
            "caption",
            "description",
            "media_type",
            "published_at",
            "imported_at",
            "style",
            "placement",
            "tags",
            "color_type",
            "session_hours",
            "featured",
            "published",
            "status",
            "ai_suggested_style",
            "ai_suggested_placement",
            "ai_suggested_tags",
            "ai_confidence_score",
            "like_count",
            "comments_count",
            "media_items",
            "whatsapp_booking_url",
            "created_at",
            "updated_at",
        ]

    def get_whatsapp_booking_url(self, obj) -> str:
        phone = "918238767100"
        text = f"Hello Jainik bhai, I saw this tattoo on your website portfolio (@tatoo.iconic): {obj.title} ({obj.instagram_permalink}). I'd like to book a consultation!"
        import urllib.parse
        return f"https://wa.me/{phone}?text={urllib.parse.quote(text)}"


class InstagramSyncRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = InstagramSyncRecord
        fields = "__all__"


class SyncBatchLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = SyncBatchLog
        fields = "__all__"


class PostApprovalSerializer(serializers.Serializer):
    """
    Artist Review & Approval Payload (Phase 5)
    """
    style_name = serializers.CharField(required=False, allow_blank=True)
    placement_name = serializers.CharField(required=False, allow_blank=True)
    title = serializers.CharField(required=False, allow_blank=True)
    color_type = serializers.CharField(required=False, allow_blank=True)
    featured = serializers.BooleanField(required=False)
    tags = serializers.ListField(child=serializers.CharField(), required=False)
