import { INITIAL_BOOKINGS } from "@/data/bookings";
import type { BookingRequest, BookingStatus, ServiceType } from "@/types";

const STORAGE_KEY = "tattoo_iconic_bookings_v5";

function getStoredBookings(): BookingRequest[] {
  if (typeof window === "undefined") return INITIAL_BOOKINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_BOOKINGS));
      return INITIAL_BOOKINGS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_BOOKINGS));
      return INITIAL_BOOKINGS;
    }
    return parsed;
  } catch {
    return INITIAL_BOOKINGS;
  }
}

function saveStoredBookings(items: BookingRequest[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error("Failed to save bookings to local storage:", err);
  }
}

export const bookingService = {
  async getAll(filter?: {
    status?: BookingStatus | "all";
    search?: string;
    serviceType?: ServiceType;
  }): Promise<BookingRequest[]> {
    let items = getStoredBookings();

    if (filter?.status && filter.status !== "all") {
      items = items.filter((b) => b.status === filter.status);
    }

    if (filter?.serviceType) {
      items = items.filter((b) => b.service_type === filter.serviceType);
    }

    if (filter?.search && filter.search.trim()) {
      const q = filter.search.toLowerCase();
      items = items.filter(
        (b) =>
          b.customer_name.toLowerCase().includes(q) ||
          b.customer_email.toLowerCase().includes(q) ||
          b.customer_phone.includes(q) ||
          b.tattoo_description.toLowerCase().includes(q) ||
          b.tattoo_style.toLowerCase().includes(q)
      );
    }

    return items;
  },

  async getBookings(filter?: {
    status?: BookingStatus | "all";
    search?: string;
    serviceType?: ServiceType;
  }): Promise<BookingRequest[]> {
    return this.getAll(filter);
  },

  async getById(id: string): Promise<BookingRequest | null> {
    const items = getStoredBookings();
    return items.find((b) => b.id === id) || null;
  },

  async getBookingById(id: string): Promise<BookingRequest | null> {
    return this.getById(id);
  },

  async create(data: Partial<BookingRequest>): Promise<BookingRequest> {
    const items = getStoredBookings();
    const newBooking: BookingRequest = {
      id: `bk-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
      customer_name: data.customer_name || "Guest Collector",
      customer_email: data.customer_email || "client@tattooiconic.in",
      customer_phone: data.customer_phone || "+91 8238767100",
      whatsapp_preferred: data.whatsapp_preferred ?? true,
      service_type: data.service_type || "studio_visit",
      visitor_city: data.visitor_city || "Gujarat",
      home_address: data.home_address,
      preferred_date: data.preferred_date || new Date().toISOString().split("T")[0],
      preferred_time: data.preferred_time || "11:00 AM",
      tattoo_style: data.tattoo_style || "Custom",
      placement: data.placement || "Forearm",
      approx_size: data.approx_size || "Medium (4-6 inches)",
      color_preference: data.color_preference || "Black & Grey",
      tattoo_description: data.tattoo_description || "Custom tattoo idea",
      reference_images: data.reference_images || (data.reference_photo ? [data.reference_photo] : []),
      reference_photo: data.reference_photo || data.reference_photo_url,
      status: "pending",
      estimated_price: data.estimated_price || 5000,
      deposit_amount: data.deposit_amount || 1000,
      deposit_paid: false,
      created_at: new Date().toISOString(),
    };

    items.unshift(newBooking);
    saveStoredBookings(items);
    return newBooking;
  },

  async createBooking(data: any): Promise<BookingRequest> {
    return this.create(data);
  },

  async updateStatus(
    id: string,
    status: BookingStatus,
    artistNotes?: string,
    depositPaid?: boolean,
    depositAmount?: number
  ): Promise<BookingRequest | null> {
    const items = getStoredBookings();
    const index = items.findIndex((b) => b.id === id);
    if (index === -1) return null;

    items[index] = {
      ...items[index],
      status,
      ...(artistNotes !== undefined ? { artist_notes: artistNotes } : {}),
      ...(depositPaid !== undefined ? { deposit_paid: depositPaid } : {}),
      ...(depositAmount !== undefined ? { deposit_amount: depositAmount } : {}),
      updated_at: new Date().toISOString(),
    };

    saveStoredBookings(items);
    return items[index];
  },

  async updateBookingStatus(
    id: string,
    status: BookingStatus,
    artistNotes?: string,
    depositPaid?: boolean,
    depositAmount?: number
  ): Promise<BookingRequest | null> {
    return this.updateStatus(id, status, artistNotes, depositPaid, depositAmount);
  },

  async delete(id: string): Promise<boolean> {
    const items = getStoredBookings();
    const filtered = items.filter((b) => b.id !== id);
    saveStoredBookings(filtered);
    return true;
  },

  async deleteBooking(id: string): Promise<boolean> {
    return this.delete(id);
  },
};
