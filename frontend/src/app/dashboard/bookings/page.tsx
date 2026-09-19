"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  CalendarCheck,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  Home,
  MapPin,
  MessageCircle,
  Eye,
  X,
  CreditCard,
  DollarSign,
  AlertCircle,
  Phone,
  Mail,
} from "lucide-react";
import { bookingService } from "@/services/bookingService";
import type { BookingRequest, BookingStatus, ServiceType } from "@/types";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

const STATUS_FILTERS: (BookingStatus | "all")[] = [
  "all",
  "pending",
  "accepted",
  "deposit_required",
  "confirmed",
  "completed",
  "rejected",
  "cancelled",
];

function BookingsContent() {
  const searchParams = useSearchParams();
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [activeBooking, setActiveBooking] = useState<BookingRequest | null>(null);

  useEffect(() => {
    bookingService
      .getBookings({
        status: selectedStatus,
        search,
      })
      .then((data) => {
        setBookings(data);
        const queryId = searchParams.get("id");
        if (queryId) {
          const found = data.find((b) => b.id === queryId);
          if (found) setActiveBooking(found);
        }
      });
  }, [selectedStatus, search, searchParams]);

  async function handleStatusChange(id: string, newStatus: BookingStatus, note?: string) {
    const updated = await bookingService.updateBookingStatus(id, newStatus, note);
    if (updated) {
      setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
      setActiveBooking(updated);
      toast.success(`Booking marked as ${newStatus.replace("_", " ")}`);
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl text-white font-bold">
            Booking &amp; Request Management
          </h2>
          <p className="text-xs sm:text-sm text-ink-300 mt-1">
            Review incoming custom tattoo inquiries, require deposits, and confirm calendar appointments.
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="space-y-3">
        <div className="relative max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name, email, placement…"
            className="input-field pl-10 text-xs sm:text-sm"
          />
        </div>

        <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setSelectedStatus(s)}
              className={`rounded-xl px-3 py-1.5 text-xs font-medium capitalize transition-all whitespace-nowrap ${
                selectedStatus === s
                  ? "bg-brand text-white shadow-md shadow-brand/20 font-bold"
                  : "border border-white/10 bg-white/5 text-ink-300 hover:text-white"
              }`}
            >
              {s.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="glass-card overflow-hidden border-white/15 p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-ink-300">
            <thead className="bg-ink-950/80 text-[11px] uppercase tracking-wider text-ink-400 border-b border-white/10">
              <tr>
                <th className="p-4 font-semibold">Client</th>
                <th className="p-4 font-semibold">Concept &amp; Style</th>
                <th className="p-4 font-semibold">Placement</th>
                <th className="p-4 font-semibold">Service Mode</th>
                <th className="p-4 font-semibold">Requested Date</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-ink-400 text-xs">
                    No bookings found matching current filters.
                  </td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-white text-xs sm:text-sm">{b.customer_name}</p>
                      <p className="text-[11px] text-ink-400 truncate max-w-[140px]">{b.customer_email}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-white font-medium text-xs truncate max-w-[180px]">
                        {b.tattoo_description}
                      </p>
                      <span className="text-[10px] text-amber-300 font-semibold">
                        {b.tattoo_style}
                      </span>
                    </td>
                    <td className="p-4 text-xs">{b.placement}</td>
                    <td className="p-4">
                      {b.service_type === "home_service" ? (
                        <span className="inline-flex items-center gap-1 rounded-md bg-brand/20 text-brand-light px-2 py-0.5 text-[10px] font-semibold">
                          <Home size={10} /> Home Service
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/20 text-amber-300 px-2 py-0.5 text-[10px] font-semibold">
                          <MapPin size={10} /> Studio
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-xs font-semibold text-white whitespace-nowrap">
                      {b.preferred_date} ({b.preferred_time})
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold capitalize ${
                          b.status === "confirmed"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                            : b.status === "pending"
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                            : b.status === "deposit_required"
                            ? "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                            : b.status === "completed"
                            ? "bg-purple-500/20 text-purple-300"
                            : b.status === "rejected" || b.status === "cancelled"
                            ? "bg-red-500/20 text-red-300"
                            : "bg-white/10 text-ink-300"
                        }`}
                      >
                        {b.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => setActiveBooking(b)}
                        className="btn-secondary text-xs py-1.5 px-3 inline-flex items-center gap-1"
                      >
                        <Eye size={12} />
                        <span>Manage</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Details & Action Modal Drawer */}
      {activeBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative max-w-2xl w-full rounded-3xl border border-white/15 bg-ink-900 p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">
                  Request #{activeBooking.id}
                </span>
                <h3 className="font-display text-2xl text-white font-bold mt-0.5">
                  {activeBooking.customer_name}
                </h3>
              </div>
              <button
                onClick={() => setActiveBooking(null)}
                className="p-2 rounded-full bg-white/10 text-ink-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            {/* Client Contact Details */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs">
              <div>
                <span className="text-ink-400 block text-[10px]">Email Address</span>
                <a href={`mailto:${activeBooking.customer_email}`} className="text-white font-medium hover:underline">
                  {activeBooking.customer_email}
                </a>
              </div>
              <div>
                <span className="text-ink-400 block text-[10px]">Phone Number</span>
                <a href={`tel:${activeBooking.customer_phone}`} className="text-white font-medium hover:underline">
                  {activeBooking.customer_phone}
                </a>
              </div>
              <div>
                <span className="text-ink-400 block text-[10px]">Requested Mode</span>
                <span className="text-amber-300 font-semibold capitalize">
                  {activeBooking.service_type.replace("_", " ")}
                </span>
              </div>
            </div>

            {/* Home Address Info if Home Service */}
            {activeBooking.service_type === "home_service" && activeBooking.home_address && (
              <div className="rounded-xl border border-brand/30 bg-brand/10 p-4 text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-brand-light font-semibold">
                  <Home size={14} />
                  <span>Home Service Dispatch Address</span>
                </div>
                <p className="text-white">
                  {activeBooking.home_address.street}, {activeBooking.home_address.city} (Postcode: {activeBooking.home_address.postcode})
                </p>
                {activeBooking.home_address.notes && (
                  <p className="text-ink-300 text-[11px]">Notes: {activeBooking.home_address.notes}</p>
                )}
              </div>
            )}

            {/* Concept Details */}
            <div className="space-y-2 text-xs">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-400">
                Tattoo Concept Specifications
              </span>
              <div className="rounded-2xl border border-white/10 bg-ink-950 p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-ink-400">Preferred Style</span>
                  <span className="font-semibold text-white">{activeBooking.tattoo_style}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-400">Placement</span>
                  <span className="font-semibold text-white">{activeBooking.placement}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-400">Approximate Size</span>
                  <span className="font-semibold text-white">{activeBooking.approx_size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-400">Color Preference</span>
                  <span className="font-semibold text-white">{activeBooking.color_preference}</span>
                </div>
                <div className="pt-2 border-t border-white/5">
                  <span className="text-ink-400 block mb-1">Concept Description:</span>
                  <p className="text-ink-200 leading-relaxed italic">
                    &ldquo;{activeBooking.tattoo_description}&rdquo;
                  </p>
                </div>
              </div>
            </div>

            {/* Reference Images */}
            {activeBooking.reference_images && activeBooking.reference_images.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-ink-400">
                  Client Reference Photos ({activeBooking.reference_images.length})
                </span>
                <div className="grid grid-cols-3 gap-3">
                  {activeBooking.reference_images.map((img, i) => (
                    <a
                      key={i}
                      href={img}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="aspect-square rounded-xl overflow-hidden border border-white/15 bg-ink-950 block"
                    >
                      <img src={img} alt="Ref" className="h-full w-full object-cover" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Artist Lifecycle Actions */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-400">
                Artist Decision Actions
              </span>
              <div className="flex flex-wrap gap-2">
                {activeBooking.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleStatusChange(activeBooking.id, "accepted")}
                      className="btn-primary text-xs py-2 px-4"
                    >
                      Accept Request
                    </button>
                    <button
                      onClick={() => handleStatusChange(activeBooking.id, "deposit_required")}
                      className="btn-gold text-xs py-2 px-4"
                    >
                      Require Deposit (₹1,000)
                    </button>
                    <button
                      onClick={() => handleStatusChange(activeBooking.id, "rejected")}
                      className="btn-danger text-xs py-2 px-4"
                    >
                      Decline Request
                    </button>
                  </>
                )}

                {activeBooking.status === "deposit_required" && (
                  <button
                    onClick={() => handleStatusChange(activeBooking.id, "confirmed")}
                    className="btn-primary text-xs py-2 px-4 bg-emerald-600 hover:bg-emerald-500"
                  >
                    Confirm (Deposit Received)
                  </button>
                )}

                {activeBooking.status === "confirmed" && (
                  <button
                    onClick={() => handleStatusChange(activeBooking.id, "completed")}
                    className="btn-primary text-xs py-2 px-4 bg-purple-600 hover:bg-purple-500"
                  >
                    Mark Session as Completed
                  </button>
                )}

                {activeBooking.status !== "cancelled" && activeBooking.status !== "completed" && (
                  <button
                    onClick={() => handleStatusChange(activeBooking.id, "cancelled")}
                    className="btn-secondary text-xs py-2 px-3 text-red-400"
                  >
                    Cancel Session
                  </button>
                )}

                <a
                  href={`https://wa.me/${activeBooking.customer_phone.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary text-xs py-2 px-3 text-emerald-400 flex items-center gap-1 ml-auto"
                >
                  <MessageCircle size={14} /> Message Client
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BookingsManagementPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-white">Loading bookings…</div>}>
      <BookingsContent />
    </Suspense>
  );
}
