from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("admin/", admin.site.urls),

    # Version 1 Standardized API Endpoints
    path("api/v1/auth/", include("authentication.urls")),
    path("api/v1/", include("bookings.urls")),
    path("api/v1/portfolio/", include("portfolio.urls")),
    path("api/v1/artist/instagram/", include("instagram_sync.urls")),

    # Aliases for backwards compatibility
    path("api/portfolio/", include("portfolio.urls")),
    path("api/artist/instagram/", include("instagram_sync.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
