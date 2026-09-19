from django.urls import path
from .views import (
    BookingListCreateView,
    BookingDetailUpdateView,
    CustomerReviewListCreateView,
    CustomerReviewAdminDetailView,
)

urlpatterns = [
    # Bookings
    path("bookings/", BookingListCreateView.as_view(), name="booking-list-create"),
    path("bookings/<uuid:pk>/", BookingDetailUpdateView.as_view(), name="booking-detail-update"),

    # Reviews
    path("reviews/", CustomerReviewListCreateView.as_view(), name="review-list-create"),
    path("reviews/<uuid:pk>/", CustomerReviewAdminDetailView.as_view(), name="review-admin-detail"),
]
