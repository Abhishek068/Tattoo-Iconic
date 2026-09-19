from rest_framework import generics, permissions, status, filters
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django_filters.rest_framework import DjangoFilterBackend
from .models import BookingRequest, CustomerReview
from .serializers import (
    BookingRequestSerializer,
    BookingRequestStatusUpdateSerializer,
    CustomerReviewSerializer,
)


class BookingListCreateView(generics.ListCreateAPIView):
    """
    POST: Public customer booking inquiry (supports multipart reference photo)
    GET: Authenticated artist view to inspect all bookings
    """
    queryset = BookingRequest.objects.all().order_by("-created_at")
    serializer_class = BookingRequestSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["status", "service_type", "deposit_paid"]
    search_fields = ["customer_name", "customer_email", "customer_phone", "tattoo_description", "placement"]
    ordering_fields = ["created_at", "status", "deposit_amount"]

    def get_permissions(self):
        if self.request.method == "POST":
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(status="pending")


class BookingDetailUpdateView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET, PATCH, DELETE: Authenticated artist booking management
    """
    queryset = BookingRequest.objects.all()
    serializer_class = BookingRequestSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_serializer_class(self):
        if self.request.method in ["PATCH", "PUT"]:
            return BookingRequestStatusUpdateSerializer
        return BookingRequestSerializer


class CustomerReviewListCreateView(generics.ListCreateAPIView):
    """
    GET: Public list of published customer reviews
    POST: Public customer submission of new review (pending verification)
    """
    serializer_class = CustomerReviewSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ["service_type", "rating", "is_verified"]
    search_fields = ["client_name", "tattoo_piece", "comment", "client_location"]

    def get_queryset(self):
        if self.request.user and self.request.user.is_authenticated:
            return CustomerReview.objects.all().order_by("-created_at")
        return CustomerReview.objects.filter(is_published=True).order_by("-created_at")

    def get_permissions(self):
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        # Auto-verify if authenticated artist, otherwise unverified until reviewed
        is_auth = self.request.user and self.request.user.is_authenticated
        serializer.save(
            is_verified=True if is_auth else False,
            is_published=True,
        )


class CustomerReviewAdminDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET, PATCH, DELETE: Authenticated artist review moderation
    """
    queryset = CustomerReview.objects.all()
    serializer_class = CustomerReviewSerializer
    permission_classes = [permissions.IsAuthenticated]
