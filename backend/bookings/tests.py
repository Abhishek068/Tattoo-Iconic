import io
from PIL import Image
from django.test import TestCase
from django.contrib.auth.models import User
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APIClient
from rest_framework import status
from bookings.models import BookingRequest, CustomerReview


class BookingsAndReviewsApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.artist = User.objects.create_user(
            username="jainikpatel",
            email="jainikpatel.tattoo@gmail.com",
            password="Admin@1234",
            is_staff=True,
        )

    def test_public_can_create_booking_inquiry(self):
        """Public visitors can submit a valid booking inquiry without authentication"""
        payload = {
            "customer_name": "Pooja Trivedi",
            "customer_email": "pooja.t@gmail.com",
            "customer_phone": "+91 98980 11223",
            "service_type": "Fine Line & Minimalist",
            "placement": "Wrist",
            "size_estimate": "Small (2-3 inches)",
            "tattoo_description": "Single-needle lotus with sacred Om symbol.",
        }
        res = self.client.post("/api/v1/bookings/", data=payload, format="json")
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(BookingRequest.objects.count(), 1)
        booking = BookingRequest.objects.first()
        self.assertEqual(booking.customer_name, "Pooja Trivedi")
        self.assertEqual(booking.status, "pending")

    def test_booking_validation_rejects_short_customer_name(self):
        """Server-side validation rejects names that are under 2 characters or digits only"""
        payload = {
            "customer_name": "A",
            "customer_email": "valid@gmail.com",
            "customer_phone": "+91 98980 11223",
            "tattoo_description": "Custom Lord Shiva Trishul piece",
        }
        res = self.client.post("/api/v1/bookings/", data=payload, format="json")
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("customer_name", res.data)

    def test_booking_validation_rejects_invalid_email(self):
        """Server-side validation rejects malformed email strings"""
        payload = {
            "customer_name": "Rahul Sharma",
            "customer_email": "not-an-email",
            "customer_phone": "+91 98980 11223",
            "tattoo_description": "Custom forearm sleeve design",
        }
        res = self.client.post("/api/v1/bookings/", data=payload, format="json")
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("customer_email", res.data)

    def test_booking_validation_rejects_short_phone(self):
        """Server-side validation rejects phone numbers with fewer than 7 digits"""
        payload = {
            "customer_name": "Rahul Sharma",
            "customer_email": "rahul@gmail.com",
            "customer_phone": "123",
            "tattoo_description": "Custom forearm sleeve design",
        }
        res = self.client.post("/api/v1/bookings/", data=payload, format="json")
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("customer_phone", res.data)

    def test_booking_validation_rejects_short_description(self):
        """Server-side validation requires descriptive tattoo idea (>= 8 chars)"""
        payload = {
            "customer_name": "Rahul Sharma",
            "customer_email": "rahul@gmail.com",
            "customer_phone": "+91 98980 11223",
            "tattoo_description": "Shiva",
        }
        res = self.client.post("/api/v1/bookings/", data=payload, format="json")
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("tattoo_description", res.data)

    def test_booking_multipart_photo_upload(self):
        """Visitors can upload genuine image reference photos via multipart form"""
        file_obj = io.BytesIO()
        image = Image.new("RGB", (100, 100), color="blue")
        image.save(file_obj, "jpeg")
        file_obj.seek(0)

        photo = SimpleUploadedFile("ref_lotus.jpg", file_obj.read(), content_type="image/jpeg")

        payload = {
            "customer_name": "Meera Patel",
            "customer_email": "meera@gmail.com",
            "customer_phone": "+91 98765 43210",
            "tattoo_description": "Reference floral artwork with Sanskrit mantra.",
            "reference_photo": photo,
        }
        res = self.client.post("/api/v1/bookings/", data=payload, format="multipart")
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        booking = BookingRequest.objects.get(customer_name="Meera Patel")
        self.assertTrue(bool(booking.reference_photo))

    def test_unauthenticated_cannot_list_all_bookings(self):
        """Unauthenticated visitors cannot access list of all customer bookings"""
        res = self.client.get("/api/v1/bookings/")
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_authenticated_artist_can_list_and_update_booking(self):
        """Artist can view bookings and change status and deposit info"""
        booking = BookingRequest.objects.create(
            customer_name="Aarav Shah",
            customer_email="aarav@gmail.com",
            customer_phone="+91 98250 99887",
            tattoo_description="Trishul piece",
        )
        self.client.force_authenticate(user=self.artist)
        res = self.client.get("/api/v1/bookings/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        # Update status and deposit
        patch_res = self.client.patch(
            f"/api/v1/bookings/{booking.id}/",
            data={
                "status": "accepted",
                "artist_notes": "Consultation scheduled.",
                "deposit_paid": True,
                "deposit_amount": 1500.00,
            },
            format="json",
        )
        self.assertEqual(patch_res.status_code, status.HTTP_200_OK)
        booking.refresh_from_db()
        self.assertEqual(booking.status, "accepted")
        self.assertEqual(booking.artist_notes, "Consultation scheduled.")
        self.assertTrue(booking.deposit_paid)
        self.assertEqual(float(booking.deposit_amount), 1500.00)

    def test_customer_reviews_flow(self):
        """Public can read published reviews and submit new review"""
        review = CustomerReview.objects.create(
            client_name="Karan Dave",
            client_location="Rajpipla",
            tattoo_piece="Mahadev Back Piece",
            rating=5,
            comment="Incredible precision and spiritual depth.",
            is_published=True,
            is_verified=True,
        )
        # Public GET
        res = self.client.get("/api/v1/reviews/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        # Public POST
        new_rev_res = self.client.post(
            "/api/v1/reviews/",
            data={
                "client_name": "Disha Patel",
                "client_location": "Vadodara",
                "tattoo_piece": "Peacock Feather Script",
                "rating": 5,
                "comment": "Amazing healed results!",
                "service_type": "Studio Visit",
            },
            format="json",
        )
        self.assertEqual(new_rev_res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(CustomerReview.objects.count(), 2)

    def test_customer_review_validation_rating_range(self):
        """Review rating must be between 1 and 5"""
        res = self.client.post(
            "/api/v1/reviews/",
            data={
                "client_name": "Tester",
                "tattoo_piece": "Piece",
                "rating": 6,
                "comment": "Good piece",
            },
            format="json",
        )
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("rating", res.data)

    def test_jwt_login_flow(self):
        """Artist can login via JWT and retrieve current profile"""
        res = self.client.post(
            "/api/v1/auth/login/",
            data={"username": "jainikpatel", "password": "Admin@1234"},
            format="json",
        )
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn("access", res.data)
        self.assertIn("refresh", res.data)
        self.assertEqual(res.data["user"]["role"], "artist")

        # Test auth/me with access token
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {res.data['access']}")
        me_res = self.client.get("/api/v1/auth/me/")
        self.assertEqual(me_res.status_code, status.HTTP_200_OK)
        self.assertEqual(me_res.data["artist_profile"]["name"], "Jainik Patel")
