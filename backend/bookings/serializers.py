from rest_framework import serializers
from .models import BookingRequest, CustomerReview


class BookingRequestSerializer(serializers.ModelSerializer):
    reference_photo_display = serializers.SerializerMethodField()

    class Meta:
        model = BookingRequest
        fields = [
            "id",
            "customer_name",
            "customer_email",
            "customer_phone",
            "service_type",
            "placement",
            "size_estimate",
            "budget_range",
            "preferred_dates",
            "tattoo_description",
            "reference_photo",
            "reference_photo_url",
            "reference_photo_display",
            "status",
            "deposit_amount",
            "deposit_paid",
            "artist_notes",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def get_reference_photo_display(self, obj):
        if obj.reference_photo:
            request = self.context.get("request")
            if request:
                return request.build_absolute_uri(obj.reference_photo.url)
            return obj.reference_photo.url
        return obj.reference_photo_url or None


class BookingRequestStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookingRequest
        fields = ["status", "artist_notes", "deposit_paid", "deposit_amount"]


class CustomerReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerReview
        fields = [
            "id",
            "client_name",
            "client_location",
            "tattoo_piece",
            "rating",
            "comment",
            "healed_time",
            "service_type",
            "is_verified",
            "is_published",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]
