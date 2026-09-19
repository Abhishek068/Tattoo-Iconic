from django.core.management.base import BaseCommand
from django.utils import timezone
from portfolio.models import TattooStyle, Placement, Tag
from instagram_sync.services.sync_engine import SyncEngine
import json
import os
from pathlib import Path

class Command(BaseCommand):
    help = "Seed database with default tattoo styles, body placements, and initial authentic @tatoo.iconic works"

    def handle(self, *args, **options):
        self.stdout.write("[+] Seeding Tattoo Styles...")
        styles = [
            ("Spiritual", "Devotional, mythological deities, and sacred symbols"),
            ("Realism", "Photorealistic portraiture, wildlife, and intricate textures"),
            ("Fine Line", "Crisp single-needle linework, floral, and minimalist micro-tattoos"),
            ("Geometric", "Sacred geometry, mandalas, and dotwork symmetry"),
            ("Script", "Devanagari, Sanskrit calligraphy, quotes, and names"),
            ("Blackwork", "Solid high-contrast black ink, serpents, and illustrative motifs"),
            ("Traditional", "Timeless bold outlines, neo-traditional, and vintage art"),
            ("Custom", "Unique anatomical compositions tailored to collector stories"),
        ]
        for name, desc in styles:
            TattooStyle.objects.get_or_create(name=name, defaults={"description": desc})

        self.stdout.write("[+] Seeding Body Placements...")
        placements = [
            "Forearm", "Bicep", "Full Sleeve", "Shoulder", "Spine", "Chest",
            "Wrist", "Collarbone", "Thigh", "Neck", "Ankle",
        ]
        for p in placements:
            Placement.objects.get_or_create(name=p)

        self.stdout.write("[+] Importing authentic @tatoo.iconic posts archive...")
        json_path = Path(__file__).resolve().parent.parent.parent.parent.parent / "frontend" / "src" / "data" / "instagram-posts.json"
        if json_path.exists():
            with open(json_path, "r", encoding="utf-8") as f:
                content = f.read()
                res = SyncEngine.import_from_json_archive(content, auto_publish=True)
                self.stdout.write(self.style.SUCCESS(f"[OK] Imported {res['imported']} authentic posts!"))
        else:
            self.stdout.write(self.style.WARNING("[!] instagram-posts.json not found, seeding default sample."))

        self.stdout.write(self.style.SUCCESS("[OK] Seeding completed successfully!"))
