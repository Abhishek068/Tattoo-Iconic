import os
from django.core.management.base import BaseCommand, CommandError
from instagram_sync.services.sync_engine import SyncEngine

class Command(BaseCommand):
    help = "Bulk ingest historical Instagram posts from an official Instagram Data Export JSON file (e.g. posts_1.json)"

    def add_arguments(self, parser):
        parser.add_argument("file_path", type=str, help="Path to the JSON archive file")
        parser.add_argument("--auto-publish", action="store_true", help="Auto-publish imported items without pending review")

    def handle(self, *args, **options):
        file_path = options["file_path"]
        auto_pub = options["auto_publish"]

        if not os.path.exists(file_path):
            raise CommandError(f"File not found: {file_path}")

        self.stdout.write(f"[+] Loading archive from: {file_path}...")
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()
            
            res = SyncEngine.import_from_json_archive(content, auto_publish=auto_pub)
            self.stdout.write(
                self.style.SUCCESS(
                    f"[OK] Archive ingestion complete! Total records: {res['total_records']}, "
                    f"Imported: {res['imported']}, Skipped (Duplicates): {res['skipped']}, Failed: {res['failed']}"
                )
            )
        except Exception as e:
            raise CommandError(f"Failed to process archive: {e}")
