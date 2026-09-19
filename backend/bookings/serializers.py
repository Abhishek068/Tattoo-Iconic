import re
import os
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

    def validate_customer_name(self, value):
        cleaned = value.strip()
        if len(cleaned) < 2:
            raise serializers.ValidationError("Customer name must be at least 2 characters long.")
        if re.match(r"^[\d\W]+$", cleaned):
            raise serializers.ValidationError("Customer name must contain valid alphabetic characters.")
        return cleaned

    def validate_customer_email(self, value):
        cleaned = value.strip().lower()
        if cleaned and not re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", cleaned):
            raise serializers.ValidationError("Please provide a valid email address.")
        return cleaned

    def validate_customer_phone(self, value):
        cleaned = value.strip()
        digits = re.sub(r"[^\d+]", "", cleaned)
        if len(digits) < 7:
            raise serializers.ValidationError("Please provide a valid phone or WhatsApp number (minimum 7 digits).")
        return cleaned

    def validate_tattoo_description(self, value):
        cleaned = value.strip()
        if len(cleaned) < 8:
            raise serializers.ValidationError("Please provide a short description of your tattoo idea (at least 8 characters).")
        return cleaned

    def validate_deposit_amount(self, value):
        if value < 0:
            raise serializers.ValidationError("Deposit amount cannot be negative.")
        return value

    def validate_reference_photo(self, value):
        if value:
            # 15 MB limit
            max_size = 15 * 1024 * 1024
            if value.size > max_size:
                raise serializers.ValidationError("Reference photo file size cannot exceed 15 MB.")
            ext = os.path.splitext(value.name)[1].lower()
            if ext not in [".jpg", ".jpeg", ".png", ".webp"]:
                raise serializers.ValidationError("Only JPG, PNG, and WebP image files are permitted.")
        return value


class BookingRequestStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookingRequest
        fields = ["status", "artist_notes", "deposit_paid", "deposit_amount"]

    def validate_deposit_amount(self, value):
        if value < 0:
            raise serializers.ValidationError("Deposit amount cannot be negative.")
        return value


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

    def validate_rating(self, value):
        if not (1 <= value <= 5):
            raise serializers.ValidationError("Rating must be an integer between 1 and 5.")
        return value

    def validate_client_name(self, value):
        cleaned = value.strip()
        if len(cleaned) < 2:
            raise serializers.ValidationError("Client name must be at least 2 characters.")
        return cleaned

    def validate_comment(self, value):
        cleaned = value.strip()
        if len(cleaned) < 5:
            raise serializers.ValidationError("Review comment must be at least 5 characters.")
        return cleaned
