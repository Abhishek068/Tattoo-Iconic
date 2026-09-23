import { INITIAL_REVIEWS } from "@/data/reviews";
import type { ReviewItem } from "@/types";

const STORAGE_KEY = "tattoo_iconic_reviews_v5";

function getStoredReviews(): ReviewItem[] {
  if (typeof window === "undefined") return INITIAL_REVIEWS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_REVIEWS));
      return INITIAL_REVIEWS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_REVIEWS));
      return INITIAL_REVIEWS;
    }
    return parsed;
  } catch {
    return INITIAL_REVIEWS;
  }
}

function saveStoredReviews(items: ReviewItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error("Failed to save reviews to local storage:", err);
  }
}

export const reviewService = {
  async getAll(serviceType?: string): Promise<ReviewItem[]> {
    let items = getStoredReviews();
    if (serviceType && serviceType !== "All") {
      items = items.filter((r) => r.service_type === serviceType);
    }
    return items;
  },

  async getReviews(serviceType?: string): Promise<ReviewItem[]> {
    return this.getAll(serviceType);
  },

  async submitReview(data: Omit<ReviewItem, "id" | "created_at" | "is_verified">): Promise<ReviewItem> {
    const items = getStoredReviews();
    const newReview: ReviewItem = {
      ...data,
      id: `rev-${Date.now()}`,
      created_at: new Date().toISOString().split("T")[0],
      is_verified: true,
    };
    items.unshift(newReview);
    saveStoredReviews(items);
    return newReview;
  },

  async toggleVerify(id: string): Promise<ReviewItem | null> {
    const items = getStoredReviews();
    const index = items.findIndex((r) => r.id === id);
    if (index === -1) return null;

    items[index].is_verified = !items[index].is_verified;
    saveStoredReviews(items);
    return items[index];
  },

  async toggleHide(id: string): Promise<ReviewItem | null> {
    const items = getStoredReviews();
    const index = items.findIndex((r) => r.id === id);
    if (index === -1) return null;

    items[index].is_hidden = !items[index].is_hidden;
    saveStoredReviews(items);
    return items[index];
  },

  async delete(id: string): Promise<boolean> {
    const items = getStoredReviews();
    const filtered = items.filter((r) => r.id !== id);
    saveStoredReviews(filtered);
    return true;
  },
};
