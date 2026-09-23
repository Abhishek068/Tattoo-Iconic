"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  CalendarCheck,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  Home,
  MapPin,
  MessageCircle,
  Eye,
  X,
  CreditCard,
  AlertCircle,
  Phone,
  Mail,
  User,
  Sparkles,
  Check,
} from "lucide-react";
import { bookingService } from "@/services/booking.service";
import type { BookingRequest, BookingStatus, ServiceType } from "@/types";
import toast from "react-hot-toast";

const STATUS_FILTERS: (BookingStatus | "all")[] = [
  "all",
  "pending",
  "accepted",
  "confirmed",
  "completed",
  "rejected",
  "cancelled",
];

function BookingsInner() {
  const searchParams = useSearchParams();
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [activeBooking, setActiveBooking] = useState<BookingRequest | null>(null);
  const [artistNotes, setArtistNotes] = useState("");

  const loadData = () => {
    bookingService
      .getAll({
        status: selectedStatus,
        search,
      })
      .then((data) => {
        setBookings(data);
        const queryId = searchParams.get("id");
        if (queryId) {
          const found = data.find((b) => b.id === queryId);
          if (found) {
            setActiveBooking(found);
            setArtistNotes(found.artist_notes || "");
          }
        }
      });
  };

  useEffect(() => {
    loadData();
  }, [selectedStatus, search, searchParams]);

  async function handleStatusChange(id: string, newStatus: BookingStatus) {
    const updated = await bookingService.updateStatus(id, newStatus, artistNotes);
    if (updated) {
      toast.success(`Booking marked as ${newStatus.replace("_", " ")}`);
      if (activeBooking?.id === id) {
        setActiveBooking(updated);
      }
      loadData();
    }
  }

  async function handleDepositToggle(id: string, current: boolean) {
    const updated = await bookingService.updateStatus(id, activeBooking?.status || "confirmed", artistNotes, !current);
    if (updated) {
      toast.success(!current ? "Deposit marked as received!" : "Deposit marked as unpaid");
      setActiveBooking(updated);
      loadData();
    }
  }

  async function handleSaveNotes(id: string) {
    const updated = await bookingService.updateStatus(id, activeBooking?.status || "pending", artistNotes);
    if (updated) {
      toast.success("Artist notes saved");
      setActiveBooking(updated);
      loadData();
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl text-white font-bold tracking-wide">
            Bookings &amp; Inquiries
          </h2>
          <p className="text-xs sm:text-sm text-[#8e90a0] mt-1">
            Review custom appointment requests, confirm studio slots, and manage home visit logistics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-[#a3a4b2]">
            Total Inquiries: <strong className="text-white">{bookings.length}</strong>
          </span>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="rounded-2xl border border-white/10 bg-[#0d0f14]/80 backdrop-blur-xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Status Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1 md:pb-0">
          {STATUS_FILTERS.map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                selectedStatus === status
                  ? "bg-amber-500/20 border border-amber-500/40 text-amber-300"
                  : "border border-white/5 bg-white/5 text-[#8e90a0] hover:text-white"
              }`}
            >
              {status.replace("_", " ")}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:max-w-xs shrink-0">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8e90a0]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search collector, phone, style..."
            className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-2 text-xs text-white placeholder:text-[#525463] focus:border-amber-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Main Grid: Bookings Table + Detail Drawer */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Bookings List */}
        <div className="lg:col-span-7 space-y-3">
          {bookings.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-[#0d0f14]/80 p-12 text-center text-xs text-[#8e90a0]">
              No bookings found matching current filter.
            </div>
          ) : (
            bookings.map((b) => {
              const isSelected = activeBooking?.id === b.id;
              return (
                <div
                  key={b.id}
                  onClick={() => {
                    setActiveBooking(b);
                    setArtistNotes(b.artist_notes || "");
                  }}
                  className={`rounded-2xl border p-5 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isSelected
                      ? "border-amber-400/60 bg-[#141722] shadow-lg shadow-amber-500/10"
                      : "border-white/10 bg-[#0d0f14]/80 hover:border-white/20 hover:bg-[#10131a]"
                  }`}
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-serif text-sm font-bold text-white truncate">
                        {b.customer_name}
                      </span>
                      <span className="rounded-md bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] text-amber-200">
                        {b.tattoo_style}
                      </span>
                      {b.service_type === "home_service" && (
                        <span className="rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 text-[10px] font-semibold flex items-center gap-1">
                          <Home size={10} /> Home Visit
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#8e90a0] truncate max-w-sm">
                      {b.placement} ({b.approx_size}) · &ldquo;{b.tattoo_description}&rdquo;
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-[#747688] pt-1">
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {b.preferred_date} at {b.preferred_time}
                      </span>
                      <span>·</span>
                      <span>₹{b.estimated_price || 5000}</span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="shrink-0 text-right space-y-1">
                    <span
                      className={`text-[10px] font-bold uppercase rounded-full px-2.5 py-1 inline-block ${
                        b.status === "confirmed"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : b.status === "pending"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : b.status === "accepted"
                          ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                          : b.status === "completed"
                          ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                          : "bg-white/10 text-ink-300"
                      }`}
                    >
                      {b.status.replace("_", " ")}
                    </span>
                    <p className="text-[10px] text-[#747688]">
                      {b.deposit_paid ? "Deposit Paid" : "Deposit Pending"}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Booking Detail Pane */}
        <div className="lg:col-span-5 sticky top-24">
          {activeBooking ? (
            <div className="rounded-2xl border border-white/15 bg-[#0d0f14]/95 backdrop-blur-2xl p-6 sm:p-7 space-y-6 shadow-2xl">
              {/* Top Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-[10px] font-mono text-amber-300/80 block uppercase tracking-widest">
                    Inquiry #{activeBooking.id}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-white">
                    {activeBooking.customer_name}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold uppercase rounded-full px-2.5 py-0.5 ${
                      activeBooking.status === "confirmed"
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-amber-500/20 text-amber-300"
                    }`}
                  >
                    {activeBooking.status.replace("_", " ")}
                  </span>
                </div>
              </div>

              {/* Contact Information */}
              <div className="rounded-xl border border-white/10 bg-white/5 p-3.5 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#8e90a0] flex items-center gap-1.5">
                    <Phone size={13} className="text-amber-400" /> Phone / WhatsApp:
                  </span>
                  <a
                    href={`https://wa.me/${activeBooking.customer_phone.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    className="text-emerald-400 hover:underline font-semibold"
                  >
                    {activeBooking.customer_phone}
                  </a>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#8e90a0] flex items-center gap-1.5">
                    <Mail size={13} className="text-amber-400" /> Email:
                  </span>
                  <span className="text-white">{activeBooking.customer_email}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#8e90a0] flex items-center gap-1.5">
                    <MapPin size={13} className="text-amber-400" /> Service Location:
                  </span>
                  <span className="text-white font-medium">
                    {activeBooking.service_type === "home_service"
                      ? `Home: ${activeBooking.home_address?.city || activeBooking.visitor_city || "Gujarat"}`
                      : `Studio Visit: ${activeBooking.visitor_city || "Rajpipla Atelier"}`}
                  </span>
                </div>
              </div>

              {/* Tattoo Concept Details */}
              <div className="space-y-2 text-xs">
                <h4 className="font-semibold text-white uppercase tracking-wider text-[11px]">
                  Tattoo Concept &amp; Specifications
                </h4>
                <div className="p-3.5 rounded-xl border border-white/5 bg-[#12141c] space-y-2">
                  <p className="text-[#cacad3] leading-relaxed">
                    &ldquo;{activeBooking.tattoo_description}&rdquo;
                  </p>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5 text-[11px] text-[#8e90a0]">
                    <div>
                      <span className="block text-[10px] text-[#525463]">STYLE</span>
                      <strong className="text-amber-200">{activeBooking.tattoo_style}</strong>
                    </div>
                    <div>
                      <span className="block text-[10px] text-[#525463]">PLACEMENT</span>
                      <strong className="text-white">{activeBooking.placement}</strong>
                    </div>
                    <div>
                      <span className="block text-[10px] text-[#525463]">APPROX SIZE</span>
                      <strong className="text-white">{activeBooking.approx_size}</strong>
                    </div>
                    <div>
                      <span className="block text-[10px] text-[#525463]">ESTIMATED FEE</span>
                      <strong className="text-emerald-400">₹{activeBooking.estimated_price || 5000}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Artist Notes & Deposit Tracker */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-white uppercase tracking-wider text-[11px]">
                    Artist Notes &amp; Logistics
                  </h4>
                  <button
                    onClick={() => handleDepositToggle(activeBooking.id, activeBooking.deposit_paid)}
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border transition-colors ${
                      activeBooking.deposit_paid
                        ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                        : "bg-white/5 border-white/10 text-[#8e90a0] hover:text-white"
                    }`}
                  >
                    {activeBooking.deposit_paid ? "✓ Deposit Received" : "+ Mark Deposit Paid"}
                  </button>
                </div>

                <textarea
                  value={artistNotes}
                  onChange={(e) => setArtistNotes(e.target.value)}
                  placeholder="Add private studio notes, stencil scaling advice, or home address landmark..."
                  rows={2}
                  className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white focus:border-amber-400 focus:outline-none"
                />
                <div className="flex justify-end">
                  <button
                    onClick={() => handleSaveNotes(activeBooking.id)}
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-[#a3a4b2] hover:text-white hover:bg-white/10 transition-colors"
                  >
                    Save Notes
                  </button>
                </div>
              </div>

              {/* Action Buttons: Accept / Reject / Complete / Cancel */}
              <div className="pt-4 border-t border-white/10 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleStatusChange(activeBooking.id, "accepted")}
                    className="rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-200 py-2.5 text-xs font-bold hover:bg-blue-500/30 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Check size={14} /> Accept Inquiry
                  </button>
                  <button
                    onClick={() => handleStatusChange(activeBooking.id, "confirmed")}
                    className="rounded-xl bg-gradient-to-r from-[#c5a059] to-[#d8b467] text-[#0a0a0a] py-2.5 text-xs font-bold uppercase tracking-wider hover:brightness-110 transition-all flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 size={14} /> Confirm Session
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleStatusChange(activeBooking.id, "completed")}
                    className="rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-200 py-2 text-xs font-medium hover:bg-purple-500/30 transition-all"
                  >
                    Mark Completed
                  </button>
                  <button
                    onClick={() => handleStatusChange(activeBooking.id, "cancelled")}
                    className="rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 py-2 text-xs font-medium hover:bg-red-500/20 transition-all"
                  >
                    Reject / Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-[#0d0f14]/80 p-8 text-center text-xs text-[#8e90a0]">
              Select any booking inquiry on the left to view customer contact info, concept details, and actions.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ArtistBookingsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs text-[#8e90a0]">Loading bookings...</div>}>
      <BookingsInner />
    </Suspense>
  );
}
