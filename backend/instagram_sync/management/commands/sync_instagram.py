from django.core.management.base import BaseCommand
from instagram_sync.services.sync_engine import SyncEngine

class Command(BaseCommand):
    help = "Run Instagram Live Synchronization Engine for @tatoo.iconic"

    def add_arguments(self, parser):
        parser.add_argument("--pages", type=int, default=5, help="Number of API pages to fetch")
        parser.add_argument("--auto-publish", action="store_true", help="Auto-publish imported items")

    def handle(self, *args, **options):
        pages = options["pages"]
        auto_pub = options["auto_publish"]
        self.stdout.write(f"[+] Starting Instagram sync (max {pages} pages)...")
        log = SyncEngine.run_live_sync(limit_pages=pages, auto_publish=auto_pub)
        self.stdout.write(
            self.style.SUCCESS(
                f"[OK] Sync complete! Status: {log.status}, Processed: {log.total_processed}, "
                f"Imported: {log.imported_count}, Skipped: {log.skipped_count}, Failed: {log.failed_count}"
            )
        )
