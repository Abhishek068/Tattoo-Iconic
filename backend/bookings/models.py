import uuid
from django.db import models


class BookingRequest(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("reviewed", "Reviewed"),
        ("accepted", "Accepted"),
        ("scheduled", "Scheduled"),
        ("completed", "Completed"),
        ("declined", "Declined"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    customer_name = models.CharField(max_length=200)
    customer_email = models.EmailField()
    customer_phone = models.CharField(max_length=50)
    service_type = models.CharField(max_length=150, default="Custom Tattoo Art")
    placement = models.CharField(max_length=100, default="Forearm")
    size_estimate = models.CharField(max_length=100, default="Medium (4-6 inches)")
    budget_range = models.CharField(max_length=100, blank=True, default="")
    preferred_dates = models.CharField(max_length=200, blank=True, default="")
    tattoo_description = models.TextField()
    reference_photo = models.ImageField(upload_to="booking_references/", blank=True, null=True)
    reference_photo_url = models.URLField(max_length=1000, blank=True, default="")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    deposit_amount = models.DecimalField(max_digits=10, decimal_places=2, default=1000.00)
    deposit_paid = models.BooleanField(default=False)
    artist_notes = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Booking Request"
        verbose_name_plural = "Booking Requests"

    def __str__(self):
        return f"{self.customer_name} - {self.service_type} ({self.status})"


class CustomerReview(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    client_name = models.CharField(max_length=150)
    client_location = models.CharField(max_length=150, default="Gujarat, India")
    tattoo_piece = models.CharField(max_length=200)
    rating = models.IntegerField(default=5)
    comment = models.TextField()
    healed_time = models.CharField(max_length=100, default="Healed 6 Months")
    service_type = models.CharField(max_length=100, default="Studio Visit")
    is_verified = models.BooleanField(default=True)
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Customer Review"
        verbose_name_plural = "Customer Reviews"

    def __str__(self):
        return f"{self.client_name} - {self.tattoo_piece} ({self.rating}★)"
