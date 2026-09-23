import { INITIAL_INSTAGRAM_DASHBOARD, INITIAL_INSTAGRAM_POSTS, type InstagramDashboardData } from "@/data/instagram";
import type { InstagramPostItem } from "@/types";

const STORAGE_KEY = "tattoo_iconic_instagram_dashboard_v5";

function getStoredDashboard(): InstagramDashboardData {
  if (typeof window === "undefined") return INITIAL_INSTAGRAM_DASHBOARD;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : INITIAL_INSTAGRAM_DASHBOARD;
  } catch {
    return INITIAL_INSTAGRAM_DASHBOARD;
  }
}

function saveStoredDashboard(data: InstagramDashboardData) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error("Failed to save instagram dashboard data:", err);
  }
}

export type InstagramStatusResponse = {
  success: boolean;
  account: InstagramDashboardData["account"];
  stats: InstagramDashboardData["stats"];
  auto_publish_enabled: boolean;
};

export type PendingReviewItem = InstagramDashboardData["pending_items"][0];
export type SyncBatchHistoryItem = InstagramDashboardData["sync_history"][0];

export const instagramApi = {
  async getStatus(): Promise<InstagramStatusResponse> {
    const data = getStoredDashboard();
    return {
      success: true,
      account: data.account,
      stats: data.stats,
      auto_publish_enabled: false,
    };
  },

  async triggerSync(autoPublish: boolean = false) {
    const data = getStoredDashboard();
    data.stats.last_sync_at = new Date().toISOString();
    data.stats.last_sync_status = "COMPLETED";
    
    // Add mock sync history batch
    data.sync_history.unshift({
      id: `batch-${Date.now()}`,
      started_at: new Date(Date.now() - 45000).toISOString(),
      completed_at: new Date().toISOString(),
      total_processed: 6,
      imported_count: 2,
      skipped_count: 4,
      failed_count: 0,
      status: "COMPLETED",
      log_details: { sync_source: "mock_curated_feed", auto_publish: autoPublish },
    });

    saveStoredDashboard(data);

    return {
      success: true,
      message: "Sync completed with @tatoo.iconic profile. Catalog refreshed!",
      imported: 2,
      skipped: 4,
      failed: 0,
    };
  },

  async getPendingReview(): Promise<PendingReviewItem[]> {
    const data = getStoredDashboard();
    return data.pending_items;
  },

  async approvePost(itemId: string, updates?: { style_name?: string; placement_name?: string; title?: string }) {
    const data = getStoredDashboard();
    const index = data.pending_items.findIndex((item) => item.id === itemId);
    if (index !== -1) {
      data.pending_items.splice(index, 1);
      data.stats.pending_review = Math.max(0, data.stats.pending_review - 1);
      data.stats.published_count += 1;
      saveStoredDashboard(data);
    }
    return { success: true, message: "Post approved and published to portfolio!" };
  },

  async approveAll() {
    const data = getStoredDashboard();
    const count = data.pending_items.length;
    data.stats.published_count += count;
    data.stats.pending_review = 0;
    data.pending_items = [];
    saveStoredDashboard(data);
    return { success: true, message: "All pending posts approved!", approved_count: count };
  },

  async hidePost(itemId: string) {
    const data = getStoredDashboard();
    const index = data.pending_items.findIndex((item) => item.id === itemId);
    if (index !== -1) {
      data.pending_items.splice(index, 1);
      data.stats.pending_review = Math.max(0, data.stats.pending_review - 1);
      data.stats.hidden_count += 1;
      saveStoredDashboard(data);
    }
    return { success: true, message: "Post hidden from portfolio." };
  },

  async getHistory(): Promise<SyncBatchHistoryItem[]> {
    const data = getStoredDashboard();
    return data.sync_history;
  },

  async uploadArchiveFile(file: File) {
    return {
      success: true,
      message: `Archive file ${file.name} processed successfully in development simulation.`,
      imported_count: 5,
    };
  },
};
