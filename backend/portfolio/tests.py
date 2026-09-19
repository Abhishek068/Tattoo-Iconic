from django.contrib.auth.models import User
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from portfolio.models import PortfolioItem, TattooStyle, Placement, InstagramSyncRecord
from instagram_sync.services.ai_classifier import AIClassifier
from instagram_sync.services.sync_engine import SyncEngine

class PortfolioApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.style = TattooStyle.objects.create(name="Spiritual", slug="spiritual")
        self.placement = Placement.objects.create(name="Forearm", slug="forearm")
        
        self.item1 = PortfolioItem.objects.create(
            instagram_media_id="test-post-1",
            title="Lord Shiva Cosmic Trishul",
            caption="Lord Shiva Trishul #Mahadev #Spiritual",
            style=self.style,
            placement=self.placement,
            status="PUBLISHED",
            published=True,
            like_count=5000,
        )

        self.pending_item = PortfolioItem.objects.create(
            instagram_media_id="test-post-pending",
            title="Hanuman Ji Devotional",
            caption="Lord Hanuman Ji Devotional #Hanuman",
            status="PENDING",
            published=False,
        )

    def test_public_portfolio_list_pagination(self):
        """Public portfolio returns only published items with pagination"""
        res = self.client.get("/api/portfolio/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        data = res.json()
        self.assertIn("results", data)
        self.assertEqual(len(data["results"]), 1)
        self.assertEqual(data["results"][0]["title"], "Lord Shiva Cosmic Trishul")

    def test_style_filtering(self):
        """Filtering by style works accurately"""
        res = self.client.get("/api/portfolio/?style=Spiritual")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.json()["results"]), 1)

        res_empty = self.client.get("/api/portfolio/?style=Geometric")
        self.assertEqual(len(res_empty.json()["results"]), 0)

    def test_ai_classifier(self):
        """AI Classifier detects devotional spiritual themes and placement"""
        classification = AIClassifier.classify(
            caption="🔱 Lord Shiva Cosmic Trishul & Rudraksha on forearm! #Mahadev #ShivaTrishul"
        )
        self.assertEqual(classification["suggested_style"], "Spiritual")
        self.assertEqual(classification["suggested_placement"], "Forearm")
        self.assertIn("Mahadev", classification["suggested_tags"])

    def test_duplicate_prevention(self):
        """Duplicate sync requests update existing records without creating new items"""
        initial_count = PortfolioItem.objects.count()
        payload = {
            "id": "test-post-1",
            "caption": "Updated caption with more likes",
            "like_count": 6500,
            "media_url": "/images/tattoos/shiva-trishul-tattoo.jpg",
        }
        item, action = SyncEngine.process_single_post(payload)
        self.assertEqual(action, "UPDATED")
        self.assertEqual(PortfolioItem.objects.count(), initial_count)
        self.assertEqual(item.like_count, 6500)

    def test_artist_approval_workflow(self):
        """Artist can approve pending posts and publish them to the portfolio"""
        self.assertEqual(self.pending_item.status, "PENDING")
        user = User.objects.create_user(username="testartist", password="password", is_staff=True)
        self.client.force_authenticate(user=user)
        res = self.client.post(
            f"/api/artist/instagram/{self.pending_item.id}/approve/",
            data={"style_name": "Spiritual", "placement_name": "Forearm", "title": "Approved Hanuman Piece"},
            format="json",
        )
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.pending_item.refresh_from_db()
        self.assertEqual(self.pending_item.status, "PUBLISHED")
        self.assertTrue(self.pending_item.published)
        self.assertEqual(self.pending_item.title, "Approved Hanuman Piece")
