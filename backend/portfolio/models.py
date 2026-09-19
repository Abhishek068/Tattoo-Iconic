import uuid
from django.db import models
from django.utils.text import slugify

class TattooStyle(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True, blank=True)
    description = models.TextField(blank=True)
    active = models.BooleanField(default=True)

    class Meta:
        ordering = ["name"]
        verbose_name = "Tattoo Style"
        verbose_name_plural = "Tattoo Styles"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Placement(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True, blank=True)

    class Meta:
        ordering = ["name"]
        verbose_name = "Body Placement"
        verbose_name_plural = "Body Placements"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Tag(models.Model):
    name = models.CharField(max_length=80, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)

    class Meta:
        ordering = ["name"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class PortfolioItem(models.Model):
    STATUS_CHOICES = [
        ("PENDING", "Pending Review"),
        ("APPROVED", "Approved"),
        ("PUBLISHED", "Published"),
        ("HIDDEN", "Hidden"),
        ("FAILED", "Failed Sync"),
        ("SOURCE_UNAVAILABLE", "Source Unavailable"),
    ]

    MEDIA_TYPE_CHOICES = [
        ("IMAGE", "Single Image"),
        ("VIDEO", "Video / Reel"),
        ("CAROUSEL_ALBUM", "Carousel Album"),
    ]

    COLOR_CHOICES = [
        ("Black & Grey", "Black & Grey"),
        ("Color", "Color"),
        ("Single Needle", "Single Needle"),
        ("Mixed", "Mixed"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    instagram_media_id = models.CharField(
        max_length=100, unique=True, null=True, blank=True, db_index=True
    )
    instagram_permalink = models.URLField(max_length=500, blank=True)
    title = models.CharField(max_length=255)
    caption = models.TextField(blank=True)
    description = models.TextField(blank=True)
    media_type = models.CharField(
        max_length=30, choices=MEDIA_TYPE_CHOICES, default="IMAGE"
    )
    published_at = models.DateTimeField(null=True, blank=True, db_index=True)
    imported_at = models.DateTimeField(auto_now_add=True)

    style = models.ForeignKey(
        TattooStyle,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="portfolio_items",
        db_index=True,
    )
    placement = models.ForeignKey(
        Placement,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="portfolio_items",
        db_index=True,
    )
    tags = models.ManyToManyField(Tag, blank=True, related_name="portfolio_items")

    color_type = models.CharField(
        max_length=50, choices=COLOR_CHOICES, default="Black & Grey"
    )
    session_hours = models.FloatField(null=True, blank=True)
    featured = models.BooleanField(default=False, db_index=True)
    published = models.BooleanField(default=True, db_index=True)
    status = models.CharField(
        max_length=30, choices=STATUS_CHOICES, default="PUBLISHED", db_index=True
    )

    # AI Classification Suggestions (Phase 6)
    ai_suggested_style = models.CharField(max_length=100, blank=True)
    ai_suggested_placement = models.CharField(max_length=100, blank=True)
    ai_suggested_tags = models.CharField(max_length=255, blank=True)
    ai_confidence_score = models.FloatField(default=0.0)

    # Social Engagement Cache
    like_count = models.IntegerField(default=0)
    comments_count = models.IntegerField(default=0)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-published_at", "-created_at"]
        indexes = [
            models.Index(fields=["status", "published"]),
            models.Index(fields=["featured", "published"]),
            models.Index(fields=["published_at"]),
        ]
        verbose_name = "Portfolio Item"
        verbose_name_plural = "Portfolio Items"

    def __str__(self):
        return f"{self.title} ({self.status})"

    @property
    def primary_image_url(self):
        primary = self.media_items.first()
        if primary:
            return primary.storage_url or primary.source_url
        return ""


class PortfolioMedia(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    portfolio_item = models.ForeignKey(
        PortfolioItem, on_delete=models.CASCADE, related_name="media_items"
    )
    media_type = models.CharField(max_length=20, default="IMAGE")
    source_url = models.TextField()
    storage_url = models.TextField(blank=True)
    thumbnail_url = models.TextField(blank=True)
    width = models.IntegerField(null=True, blank=True)
    height = models.IntegerField(null=True, blank=True)
    duration = models.FloatField(null=True, blank=True)
    display_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["display_order", "created_at"]
        verbose_name = "Portfolio Media"
        verbose_name_plural = "Portfolio Media Items"

    def __str__(self):
        return f"Media for {self.portfolio_item.title} ({self.media_type})"


class InstagramSyncRecord(models.Model):
    STATUS_CHOICES = [
        ("SUCCESS", "Success"),
        ("FAILED", "Failed"),
        ("SKIPPED", "Skipped"),
        ("SOURCE_UNAVAILABLE", "Source Unavailable"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    instagram_media_id = models.CharField(max_length=100, unique=True, db_index=True)
    last_synced_at = models.DateTimeField(auto_now=True)
    sync_status = models.CharField(max_length=30, choices=STATUS_CHOICES, default="SUCCESS")
    error_message = models.TextField(blank=True)
    source_updated_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-last_synced_at"]
        verbose_name = "Instagram Sync Record"
        verbose_name_plural = "Instagram Sync Records"

    def __str__(self):
        return f"IG {self.instagram_media_id} - {self.sync_status}"


class SyncBatchLog(models.Model):
    STATUS_CHOICES = [
        ("IN_PROGRESS", "In Progress"),
        ("COMPLETED", "Completed"),
        ("FAILED", "Failed"),
        ("PARTIAL", "Partial with Errors"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    total_processed = models.IntegerField(default=0)
    imported_count = models.IntegerField(default=0)
    skipped_count = models.IntegerField(default=0)
    failed_count = models.IntegerField(default=0)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default="IN_PROGRESS")
    log_details = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ["-started_at"]
        verbose_name = "Sync Batch Log"
        verbose_name_plural = "Sync Batch Logs"

    def __str__(self):
        return f"Sync Batch {self.started_at.strftime('%Y-%m-%d %H:%M')} ({self.status})"
