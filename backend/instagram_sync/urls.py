from django.urls import path
from .views import (
    InstagramStatusView,
    TriggerSyncView,
    PendingReviewListView,
    ApprovePostView,
    ApproveAllPendingView,
    HidePostView,
    RetryFailedSyncView,
    SyncHistoryListView,
    ImportJsonArchiveView,
)

urlpatterns = [
    path("status/", InstagramStatusView.as_view(), name="ig-status"),
    path("sync/", TriggerSyncView.as_view(), name="ig-sync"),
    path("pending/", PendingReviewListView.as_view(), name="ig-pending"),
    path("<uuid:item_id>/approve/", ApprovePostView.as_view(), name="ig-approve"),
    path("approve-all/", ApproveAllPendingView.as_view(), name="ig-approve-all"),
    path("<uuid:item_id>/hide/", HidePostView.as_view(), name="ig-hide"),
    path("retry/", RetryFailedSyncView.as_view(), name="ig-retry"),
    path("history/", SyncHistoryListView.as_view(), name="ig-history"),
    path("import-archive/", ImportJsonArchiveView.as_view(), name="ig-import-archive"),
]
