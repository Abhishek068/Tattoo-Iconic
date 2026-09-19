import { INITIAL_MOCK_BOOKINGS, ARTIST_PROFILE } from "@/constants";
import type { BookingRequest, BookingStatus, ServiceType } from "@/types";

const STORAGE_KEY = "jainik_bookings";

function getStoredBookings(): BookingRequest[] {
  if (typeof window === "undefined") return INITIAL_MOCK_BOOKINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_BOOKINGS));
      return INITIAL_MOCK_BOOKINGS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_MOCK_BOOKINGS;
  }
}

function saveStoredBookings(bookings: BookingRequest[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  } catch (err) {
    console.error("Failed to save bookings", err);
  }
}

export const bookingService = {
  async getBookings(filter?: { status?: BookingStatus | "all"; search?: string; serviceType?: ServiceType }): Promise<BookingRequest[]> {
    let list = getStoredBookings();

    if (filter?.status && filter.status !== "all") {
      list = list.filter((b) => b.status === filter.status);
    }

    if (filter?.serviceType) {
      list = list.filter((b) => b.service_type === filter.serviceType);
    }

    if (filter?.search && filter.search.trim()) {
      const q = filter.search.toLowerCase();
      list = list.filter(
        (b) =>
          b.customer_name.toLowerCase().includes(q) ||
          b.customer_email.toLowerCase().includes(q) ||
          b.tattoo_description.toLowerCase().includes(q) ||
          b.placement.toLowerCase().includes(q)
      );
    }

    return list;
  },

  async getBookingById(id: string): Promise<BookingRequest | null> {
    const list = getStoredBookings();
    return list.find((b) => b.id === id) || null;
  },

  async createBooking(data: Omit<BookingRequest, "id" | "status" | "deposit_amount" | "deposit_paid" | "created_at" | "updated_at">): Promise<BookingRequest> {
    const list = getStoredBookings();
    const newBooking: BookingRequest = {
      ...data,
      id: `bk-${Date.now()}`,
      status: "pending",
      deposit_amount: ARTIST_PROFILE.minimum_deposit,
      deposit_paid: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    list.unshift(newBooking);
    saveStoredBookings(list);
    return newBooking;
  },

  async updateBookingStatus(id: string, status: BookingStatus, artistNotes?: string): Promise<BookingRequest | null> {
    const list = getStoredBookings();
    const index = list.findIndex((b) => b.id === id);
    if (index === -1) return null;

    list[index].status = status;
    list[index].updated_at = new Date().toISOString();
    if (artistNotes !== undefined) {
      list[index].artist_notes = artistNotes;
    }
    saveStoredBookings(list);
    return list[index];
  },

  async deleteBooking(id: string): Promise<boolean> {
    const list = getStoredBookings();
    const filtered = list.filter((b) => b.id !== id);
    saveStoredBookings(filtered);
    return true;
  },
};
