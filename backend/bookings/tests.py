from django.test import TestCase
from django.contrib.auth.models import User
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
        """Public visitors can submit a booking inquiry without authentication"""
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

    def test_unauthenticated_cannot_list_all_bookings(self):
        """Unauthenticated visitors cannot access list of all customer bookings"""
        res = self.client.get("/api/v1/bookings/")
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_authenticated_artist_can_list_and_update_booking(self):
        """Artist can view bookings and change status"""
        booking = BookingRequest.objects.create(
            customer_name="Aarav Shah",
            customer_email="aarav@gmail.com",
            customer_phone="+91 98250 99887",
            tattoo_description="Trishul piece",
        )
        self.client.force_authenticate(user=self.artist)
        res = self.client.get("/api/v1/bookings/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        # Update status
        patch_res = self.client.patch(
            f"/api/v1/bookings/{booking.id}/",
            data={"status": "accepted", "artist_notes": "Consultation scheduled."},
            format="json",
        )
        self.assertEqual(patch_res.status_code, status.HTTP_200_OK)
        booking.refresh_from_db()
        self.assertEqual(booking.status, "accepted")
        self.assertEqual(booking.artist_notes, "Consultation scheduled.")

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
