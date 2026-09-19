import axios from "axios";
import { CUSTOMER_REVIEWS } from "@/constants";
import type { ReviewItem } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

function getAuthHeaders() {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const reviewService = {
  async getReviews(serviceType?: string): Promise<ReviewItem[]> {
    try {
      const params: Record<string, string> = {};
      if (serviceType && serviceType !== "All") {
        params.service_type = serviceType;
      }
      const res = await axios.get(`${API_URL}/reviews/`, {
        params,
        headers: getAuthHeaders(),
      });
      const data = res.data?.results || res.data;
      if (Array.isArray(data) && data.length > 0) {
        return data.map((r: any) => ({
          id: String(r.id),
          client_name: r.client_name,
          client_location: r.client_location,
          tattoo_piece: r.tattoo_piece,
          style: r.style || "Custom",
          rating: r.rating,
          comment: r.comment,
          healed_time: r.healed_time,
          service_type: r.service_type,
          is_verified: r.is_verified,
          created_at: r.created_at,
        }));
      }
      return CUSTOMER_REVIEWS;
    } catch (err) {
      console.warn("Using fallback reviews catalog:", err);
      let list = CUSTOMER_REVIEWS;
      if (serviceType && serviceType !== "All") {
        list = list.filter((r) => r.service_type === serviceType);
      }
      return list;
    }
  },

  async submitReview(data: Omit<ReviewItem, "id" | "created_at" | "is_verified">): Promise<ReviewItem> {
    try {
      const res = await axios.post(`${API_URL}/reviews/`, data);
      const r = res.data;
      return {
        id: String(r.id),
        client_name: r.client_name,
        client_location: r.client_location,
        tattoo_piece: r.tattoo_piece,
        style: r.style || data.style || "Custom",
        rating: r.rating,
        comment: r.comment,
        healed_time: r.healed_time,
        service_type: r.service_type,
        is_verified: r.is_verified,
        created_at: r.created_at,
      };
    } catch (err) {
      console.error("Failed to submit review to Django backend:", err);
      return {
        ...data,
        id: `rev-${Date.now()}`,
        created_at: new Date().toISOString().split("T")[0],
        is_verified: false,
      };
    }
  },
};
