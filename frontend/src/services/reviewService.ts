import { CUSTOMER_REVIEWS } from "@/constants";
import type { ReviewItem } from "@/types";

const STORAGE_KEY = "jainik_customer_reviews";

function getStoredReviews(): ReviewItem[] {
  if (typeof window === "undefined") return CUSTOMER_REVIEWS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(CUSTOMER_REVIEWS));
      return CUSTOMER_REVIEWS;
    }
    return JSON.parse(raw);
  } catch {
    return CUSTOMER_REVIEWS;
  }
}

function saveStoredReviews(reviews: ReviewItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
  } catch (err) {
    console.error("Failed to save reviews", err);
  }
}

export const reviewService = {
  async getReviews(serviceType?: string): Promise<ReviewItem[]> {
    let list = getStoredReviews();
    if (serviceType && serviceType !== "All") {
      list = list.filter((r) => r.service_type === serviceType);
    }
    return list;
  },

  async submitReview(data: Omit<ReviewItem, "id" | "created_at" | "is_verified">): Promise<ReviewItem> {
    const list = getStoredReviews();
    const newReview: ReviewItem = {
      ...data,
      id: `rev-${Date.now()}`,
      created_at: new Date().toISOString().split("T")[0],
      is_verified: true,
    };
    list.unshift(newReview);
    saveStoredReviews(list);
    return newReview;
  },
};
