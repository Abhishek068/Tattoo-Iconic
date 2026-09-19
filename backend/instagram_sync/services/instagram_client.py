import logging
import time
import requests
from django.conf import settings

logger = logging.getLogger(__name__)

class InstagramClient:
    """
    Authorised Meta/Instagram Graph API Client (Phase 1, 2, 4)
    Handles pagination, rate limiting, token refresh, and media retrieval.
    """
    GRAPH_API_BASE = "https://graph.instagram.com"
    API_VERSION = "v19.0"

    def __init__(self, access_token=None, account_id=None):
        self.access_token = access_token or getattr(settings, "INSTAGRAM_ACCESS_TOKEN", "")
        self.account_id = account_id or getattr(settings, "INSTAGRAM_ACCOUNT_ID", "me")
        self.handle = getattr(settings, "INSTAGRAM_HANDLE", "tatoo.iconic")

    def is_configured(self) -> bool:
        return bool(self.access_token)

    def verify_token(self) -> dict:
        """
        Verify the active token status with Meta Graph API.
        """
        if not self.is_configured():
            return {
                "valid": False,
                "error": "No Instagram Access Token configured in environment variables.",
            }

        url = f"{self.GRAPH_API_BASE}/me"
        params = {
            "fields": "id,username,account_type,media_count",
            "access_token": self.access_token,
        }

        try:
            res = requests.get(url, params=params, timeout=10)
            if res.ok:
                data = res.json()
                return {
                    "valid": True,
                    "account_id": data.get("id"),
                    "username": data.get("username", self.handle),
                    "account_type": data.get("account_type", "CREATOR"),
                    "media_count": data.get("media_count", 0),
                }
            else:
                err_data = res.json().get("error", {})
                return {
                    "valid": False,
                    "error": err_data.get("message", f"HTTP {res.status_code}"),
                    "code": err_data.get("code"),
                }
        except Exception as e:
            logger.error("Instagram token verification error: %s", e)
            return {"valid": False, "error": str(e)}

    def refresh_long_lived_token(self) -> dict:
        """
        Refresh long-lived (60 days) access token automatically.
        """
        if not self.is_configured():
            return {"success": False, "error": "Token not configured"}

        url = f"{self.GRAPH_API_BASE}/refresh_access_token"
        params = {
            "grant_type": "ig_refresh_token",
            "access_token": self.access_token,
        }

        try:
            res = requests.get(url, params=params, timeout=15)
            if res.ok:
                data = res.json()
                return {
                    "success": True,
                    "access_token": data.get("access_token"),
                    "expires_in": data.get("expires_in"),
                }
            return {"success": False, "error": res.text}
        except Exception as e:
            return {"success": False, "error": str(e)}

    def fetch_media_page(self, limit: int = 50, after: str = None) -> dict:
        """
        Fetch a single paginated page of media posts from Instagram Graph API.
        """
        if not self.is_configured():
            return {"success": False, "error": "API token not set"}

        url = f"{self.GRAPH_API_BASE}/me/media"
        fields = (
            "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,"
            "like_count,comments_count,children{id,media_type,media_url,thumbnail_url}"
        )
        params = {
            "fields": fields,
            "access_token": self.access_token,
            "limit": min(limit, 100),
        }
        if after:
            params["after"] = after

        max_retries = 3
        for attempt in range(1, max_retries + 1):
            try:
                res = requests.get(url, params=params, timeout=20)
                if res.status_code == 429:
                    # Rate limit encountered: Exponential backoff
                    wait_time = attempt * 5
                    logger.warning("Instagram Rate Limit encountered. Backing off for %ds...", wait_time)
                    time.sleep(wait_time)
                    continue

                if res.ok:
                    data = res.json()
                    paging = data.get("paging", {})
                    cursors = paging.get("cursors", {})
                    return {
                        "success": True,
                        "data": data.get("data", []),
                        "next_cursor": cursors.get("after") if paging.get("next") else None,
                        "has_next": bool(paging.get("next")),
                    }
                else:
                    err = res.json().get("error", {})
                    return {"success": False, "error": err.get("message", res.text), "code": err.get("code")}
            except requests.RequestException as e:
                logger.error("Attempt %d failed requesting Instagram media: %s", attempt, e)
                if attempt == max_retries:
                    return {"success": False, "error": str(e)}
                time.sleep(2)

        return {"success": False, "error": "Max retries exceeded"}
