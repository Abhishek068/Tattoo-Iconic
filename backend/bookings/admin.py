from django.contrib import admin
from django.utils.html import format_html
from .models import BookingRequest, CustomerReview


@admin.register(BookingRequest)
class BookingRequestAdmin(admin.ModelAdmin):
    list_display = [
        "customer_name",
        "customer_phone",
        "service_type",
        "placement",
        "size_estimate",
        "status",
        "deposit_amount",
        "deposit_paid",
        "created_at",
    ]
    list_filter = ["status", "deposit_paid", "service_type", "created_at"]
    search_fields = ["customer_name", "customer_email", "customer_phone", "tattoo_description", "artist_notes"]
    list_editable = ["status", "deposit_paid"]
    readonly_fields = ["id", "created_at", "updated_at", "reference_photo_preview"]
    fieldsets = (
        ("Customer Information", {
            "fields": ("customer_name", "customer_email", "customer_phone")
        }),
        ("Tattoo Specifications", {
            "fields": ("service_type", "placement", "size_estimate", "budget_range", "preferred_dates", "tattoo_description")
        }),
        ("Reference Media", {
            "fields": ("reference_photo", "reference_photo_url", "reference_photo_preview")
        }),
        ("Status & Financials", {
            "fields": ("status", "deposit_amount", "deposit_paid", "artist_notes")
        }),
        ("Timestamps", {
            "fields": ("id", "created_at", "updated_at"),
            "classes": ("collapse",),
        }),
    )

    def reference_photo_preview(self, obj):
        if obj.reference_photo:
            return format_html(
                '<a href="{0}" target="_blank"><img src="{0}" style="max-height: 200px; max-width: 300px; border-radius: 8px;" /></a>',
                obj.reference_photo.url,
            )
        if obj.reference_photo_url:
            return format_html(
                '<a href="{0}" target="_blank"><img src="{0}" style="max-height: 200px; max-width: 300px; border-radius: 8px;" /></a>',
                obj.reference_photo_url,
            )
        return "No reference photo uploaded."

    reference_photo_preview.short_description = "Reference Photo Preview"


@admin.register(CustomerReview)
class CustomerReviewAdmin(admin.ModelAdmin):
    list_display = [
        "client_name",
        "client_location",
        "tattoo_piece",
        "rating",
        "service_type",
        "is_verified",
        "is_published",
        "created_at",
    ]
    list_filter = ["rating", "is_verified", "is_published", "service_type", "created_at"]
    search_fields = ["client_name", "client_location", "tattoo_piece", "comment"]
    list_editable = ["is_verified", "is_published"]
    readonly_fields = ["id", "created_at", "updated_at"]
