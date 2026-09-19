from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from bookings.models import CustomerReview, BookingRequest


class Command(BaseCommand):
    help = "Seed authentic client reviews and sample bookings into PostgreSQL database"

    def handle(self, *args, **options):
        self.stdout.write("Seeding Reviews and Bookings...")

        # 1. Ensure Artist Superuser exists
        admin_user, created = User.objects.get_or_create(
            username="jainikpatel",
            defaults={
                "email": "jainikpatel.tattoo@gmail.com",
                "first_name": "Jainik",
                "last_name": "Patel",
                "is_staff": True,
                "is_superuser": True,
            },
        )
        if created:
            admin_user.set_password("Admin@1234")
            admin_user.save()
            self.stdout.write(self.style.SUCCESS("Created artist superuser 'jainikpatel' (password: Admin@1234)"))
        else:
            self.stdout.write("Artist superuser 'jainikpatel' already exists.")

        # 2. Seed Customer Reviews
        reviews_data = [
            {
                "client_name": "Aarav Patel",
                "client_location": "Vadodara, Gujarat",
                "tattoo_piece": "Lord Shiva Trishul & Sanskrit Mantra",
                "rating": 5,
                "comment": "Jainik's fine line work is unmatched in all of Gujarat. The spiritual energy and sacred geometry in my Trishul piece came out even better than imagined. 8 months healed and still razor sharp.",
                "healed_time": "Healed 8 Months",
                "service_type": "Studio Visit",
                "is_verified": True,
                "is_published": True,
            },
            {
                "client_name": "Sneha Desai",
                "client_location": "Rajpipla, Narmada",
                "tattoo_piece": "Micro Fine-Line Lotus & Butterfly",
                "rating": 5,
                "comment": "Had a private home session. Jainik brought hospital-grade sterilization equipment and made the entire process painless and comfortable. An absolute master.",
                "healed_time": "Healed 4 Months",
                "service_type": "Home Service",
                "is_verified": True,
                "is_published": True,
            },
            {
                "client_name": "Hardik Shah",
                "client_location": "Bharuch, Gujarat",
                "tattoo_piece": "Full Sleeve Dark Realism Lion & Crown",
                "rating": 5,
                "comment": "Three full-day sittings at the Rajpipla studio atelier. The anatomical shading and depth are astonishing. True international atelier quality right here in Gujarat.",
                "healed_time": "Healed 1 Year",
                "service_type": "Studio Visit",
                "is_verified": True,
                "is_published": True,
            },
            {
                "client_name": "Priya Sharma",
                "client_location": "Surat, Gujarat",
                "tattoo_piece": "Radha Krishna Flute & Feathers",
                "rating": 5,
                "comment": "Traveled from Surat specifically for Jainik's portraiture. The subtle stippling and gradients are breathtaking. Worth every single kilometer traveled.",
                "healed_time": "Healed 6 Months",
                "service_type": "Custom Project",
                "is_verified": True,
                "is_published": True,
            },
            {
                "client_name": "Karan Mehta",
                "client_location": "Ahmedabad, Gujarat",
                "tattoo_piece": "Lord Hanuman Ji Devotional Piece",
                "rating": 5,
                "comment": "The saffron tilak pigment and devotional intensity in Hanuman Ji's eyes are extraordinary. Best tattoo experience of my life.",
                "healed_time": "Healed 3 Months",
                "service_type": "Studio Visit",
                "is_verified": True,
                "is_published": True,
            },
        ]

        for r_data in reviews_data:
            review, created = CustomerReview.objects.get_or_create(
                client_name=r_data["client_name"],
                tattoo_piece=r_data["tattoo_piece"],
                defaults=r_data,
            )
            if created:
                self.stdout.write(f"Created review for {review.client_name}")

        # 3. Seed Sample Bookings
        bookings_data = [
            {
                "customer_name": "Rohan Joshi",
                "customer_email": "rohan.joshi@gmail.com",
                "customer_phone": "+91 98250 12345",
                "service_type": "Custom Tattoo Art",
                "placement": "Right Forearm",
                "size_estimate": "Medium (4-6 inches)",
                "budget_range": "₹5,000 - ₹10,000",
                "preferred_dates": "Next Weekend (Saturday morning)",
                "tattoo_description": "Lord Shiva Trishul with sacred Damru and Om Namah Shivaya Sanskrit calligraphy.",
                "status": "pending",
                "deposit_amount": 1000.00,
                "deposit_paid": False,
                "artist_notes": "Client requested single-needle 3RL fine line.",
            },
            {
                "customer_name": "Meera Trivedi",
                "customer_email": "meera.trivedi@outlook.com",
                "customer_phone": "+91 97240 67890",
                "service_type": "Luxury Home Service",
                "placement": "Upper Spine / Shoulder",
                "size_estimate": "Large (6-8 inches)",
                "budget_range": "₹10,000 - ₹20,000",
                "preferred_dates": "First week of next month",
                "tattoo_description": "Sacred Geometric Mandala flowing down the spine with floral accents.",
                "status": "accepted",
                "deposit_amount": 2000.00,
                "deposit_paid": True,
                "artist_notes": "Home visit in Vadodara confirmed. Sterilization kit prepared.",
            },
            {
                "customer_name": "Vikram Solanki",
                "customer_email": "vikram.solanki@gmail.com",
                "customer_phone": "+91 99090 54321",
                "service_type": "Large Scale / Sleeves",
                "placement": "Full Left Sleeve",
                "size_estimate": "Full Sleeve",
                "budget_range": "₹35,000+",
                "preferred_dates": "Flexible across 3 sessions",
                "tattoo_description": "Dark Realism Royal Lion with Roman Numerals and Imperial Crown.",
                "status": "scheduled",
                "deposit_amount": 5000.00,
                "deposit_paid": True,
                "artist_notes": "Session 1 scheduled for next Tuesday at Bhadam Studio.",
            },
        ]

        for b_data in bookings_data:
            booking, created = BookingRequest.objects.get_or_create(
                customer_name=b_data["customer_name"],
                customer_email=b_data["customer_email"],
                defaults=b_data,
            )
            if created:
                self.stdout.write(f"Created booking inquiry for {booking.customer_name}")

        self.stdout.write(self.style.SUCCESS("Successfully seeded reviews and bookings!"))
