import axios from "axios";
import type { BookingRequest, BookingStatus, ServiceType } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

function getAuthHeaders() {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const bookingService = {
  async getBookings(filter?: {
    status?: BookingStatus | "all";
    search?: string;
    serviceType?: ServiceType;
  }): Promise<BookingRequest[]> {
    try {
      const params: Record<string, string> = {};
      if (filter?.status && filter.status !== "all") {
        params.status = filter.status;
      }
      if (filter?.serviceType) {
        params.service_type = filter.serviceType;
      }
      if (filter?.search && filter.search.trim()) {
        params.search = filter.search.trim();
      }

      const res = await axios.get(`${API_URL}/bookings/`, {
        params,
        headers: getAuthHeaders(),
      });

      const data = res.data?.results || res.data;
      if (Array.isArray(data)) {
        return data.map((b: any) => ({
          ...b,
          id: String(b.id),
          reference_photo: b.reference_photo_display || b.reference_photo || b.reference_photo_url,
        }));
      }
      return [];
    } catch (err) {
      console.error("Failed to fetch bookings from Django API:", err);
      return [];
    }
  },

  async getBookingById(id: string): Promise<BookingRequest | null> {
    try {
      const res = await axios.get(`${API_URL}/bookings/${id}/`, {
        headers: getAuthHeaders(),
      });
      const b = res.data;
      return {
        ...b,
        id: String(b.id),
        reference_photo: b.reference_photo_display || b.reference_photo || b.reference_photo_url,
      };
    } catch (err) {
      console.error("Failed to fetch booking by ID:", err);
      return null;
    }
  },

  async createBooking(
    data: any
  ): Promise<BookingRequest> {
    let headers: Record<string, string> = {};
    let payload: any = data;

    if (data instanceof FormData) {
      headers["Content-Type"] = "multipart/form-data";
    } else if (typeof data === "object" && data !== null) {
      payload = {
        customer_name: data.customer_name || "Guest Client",
        customer_email: data.customer_email || `${data.customer_phone?.replace(/\D/g, "") || "client"}@tattooiconic.in`,
        customer_phone: data.customer_phone || "+91 8238767100",
        service_type:
          data.service_type === "home_service"
            ? "Luxury Home Service"
            : data.service_type === "studio_visit"
            ? "Studio Visit"
            : data.service_type || "Custom Tattoo Art",
        placement: data.placement || "Forearm",
        size_estimate: data.approx_size || data.size_estimate || "Medium (4-6 inches)",
        budget_range: data.budget_range || "",
        preferred_dates: `${data.preferred_date || ""} ${data.preferred_time || ""}`.trim(),
        tattoo_description: [
          data.tattoo_style ? `[Style: ${data.tattoo_style}]` : "",
          data.tattoo_description || "",
          data.address ? `[Location: ${data.address}]` : "",
        ]
          .filter(Boolean)
          .join(" "),
        reference_photo_url:
          Array.isArray(data.reference_images) && data.reference_images.length > 0
            ? data.reference_images[0]
            : data.reference_photo || data.reference_photo_url || "",
      };
    }

    const res = await axios.post(`${API_URL}/bookings/`, payload, { headers });
    const b = res.data;
    return {
      ...b,
      id: String(b.id),
      reference_photo: b.reference_photo_display || b.reference_photo || b.reference_photo_url,
    };
  },

  async updateBookingStatus(
    id: string,
    status: BookingStatus,
    artistNotes?: string,
    depositPaid?: boolean,
    depositAmount?: number
  ): Promise<BookingRequest | null> {
    try {
      const patchData: Record<string, any> = { status };
      if (artistNotes !== undefined) patchData.artist_notes = artistNotes;
      if (depositPaid !== undefined) patchData.deposit_paid = depositPaid;
      if (depositAmount !== undefined) patchData.deposit_amount = depositAmount;

      const res = await axios.patch(`${API_URL}/bookings/${id}/`, patchData, {
        headers: getAuthHeaders(),
      });
      const b = res.data;
      return {
        ...b,
        id: String(b.id),
        reference_photo: b.reference_photo_display || b.reference_photo || b.reference_photo_url,
      };
    } catch (err) {
      console.error("Failed to update booking status:", err);
      return null;
    }
  },

  async deleteBooking(id: string): Promise<boolean> {
    try {
      await axios.delete(`${API_URL}/bookings/${id}/`, {
        headers: getAuthHeaders(),
      });
      return true;
    } catch (err) {
      console.error("Failed to delete booking:", err);
      return false;
    }
  },
};
