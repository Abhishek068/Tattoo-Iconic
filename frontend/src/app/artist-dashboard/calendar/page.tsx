"use client";

import { useState, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Home,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Plus,
  Lock,
  Unlock,
} from "lucide-react";
import { bookingService } from "@/services/booking.service";
import { availabilityService } from "@/services/availability.service";
import type { BookingRequest } from "@/types";
import toast from "react-hot-toast";

export default function ArtistCalendarPage() {
  const [view, setView] = useState<"month" | "week" | "day">("month");
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("2026-09-24");

  useEffect(() => {
    bookingService.getAll().then(setBookings);
    availabilityService.getBlockedDates().then(setBlockedDates);
  }, []);

  const daysInMonth = 30; // September 2026
  const monthName = "September 2026";

  async function handleToggleBlock(dateStr: string) {
    const updated = await availabilityService.toggleBlockDate(dateStr);
    setBlockedDates(updated);
    if (updated.includes(dateStr)) {
      toast.success(`Date ${dateStr} blocked for studio off-day`);
    } else {
      toast.success(`Date ${dateStr} unblocked and opened for bookings`);
    }
  }

  // Find bookings on selected date
  const dateBookings = bookings.filter((b) => b.preferred_date === selectedDate);
  const isSelectedBlocked = blockedDates.includes(selectedDate);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl text-white font-bold tracking-wide">
            Studio Calendar &amp; Schedule
          </h2>
          <p className="text-xs sm:text-sm text-[#8e90a0] mt-1">
            Manage your daily appointments, mobile home travel slots, and studio off-days.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-2">
          <div className="rounded-xl border border-white/10 bg-white/5 p-1 flex items-center">
            {(["month", "week", "day"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-all ${
                  view === v
                    ? "bg-[#c5a059] text-black font-bold"
                    : "text-[#8e90a0] hover:text-white"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Calendar Grid View */}
        <div className="lg:col-span-8 rounded-2xl border border-white/10 bg-[#0d0f14]/80 backdrop-blur-xl p-6 space-y-6">
          {/* Month Header */}
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl text-white font-bold tracking-wide">
              {monthName}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#8e90a0]">Click any date to view slots or toggle off-day</span>
            </div>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-[#8e90a0] pb-2 border-b border-white/10">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>

          {/* Month Days Grid */}
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={`empty-${i}`} className="min-h-[85px] rounded-xl border border-transparent p-2 opacity-20" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `2026-09-${String(dayNum).padStart(2, "0")}`;
              const dayBookings = bookings.filter((b) => b.preferred_date === dateStr);
              const isBlocked = blockedDates.includes(dateStr);
              const isSelected = selectedDate === dateStr;

              return (
                <div
                  key={dateStr}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`min-h-[85px] rounded-xl border p-2 flex flex-col justify-between transition-all cursor-pointer ${
                    isSelected
                      ? "border-amber-400 bg-amber-500/15 shadow-md shadow-amber-500/10"
                      : isBlocked
                      ? "border-red-500/20 bg-red-500/5 text-red-300"
                      : dayBookings.length > 0
                      ? "border-emerald-500/30 bg-emerald-500/5 text-white"
                      : "border-white/5 bg-white/[0.02] text-ink-300 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className={isSelected ? "text-amber-300 font-bold" : ""}>{dayNum}</span>
                    {isBlocked ? (
                      <span className="text-[9px] text-red-400">Off</span>
                    ) : dayBookings.length > 0 ? (
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    ) : null}
                  </div>

                  <div className="space-y-1">
                    {dayBookings.slice(0, 2).map((b) => (
                      <div
                        key={b.id}
                        className={`truncate rounded px-1 py-0.5 text-[9px] font-medium ${
                          b.service_type === "home_service"
                            ? "bg-amber-500/20 text-amber-300"
                            : "bg-emerald-500/20 text-emerald-300"
                        }`}
                      >
                        {b.customer_name}
                      </div>
                    ))}
                    {dayBookings.length > 2 && (
                      <span className="text-[8px] text-[#8e90a0]">+{dayBookings.length - 2} more</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-[#8e90a0] pt-4 border-t border-white/10">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" /> Studio Appointment
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" /> Luxury Home Visit
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400" /> Blocked Studio Off-Day
            </span>
          </div>
        </div>

        {/* Right Date Details Pane */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-white/15 bg-[#0d0f14]/95 backdrop-blur-2xl p-6 space-y-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-mono text-[#8e90a0] uppercase">Selected Date</span>
                <h3 className="font-serif text-lg font-bold text-white">{selectedDate}</h3>
              </div>
              <button
                onClick={() => handleToggleBlock(selectedDate)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isSelectedBlocked
                    ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30"
                    : "bg-red-500/20 border border-red-500/40 text-red-300 hover:bg-red-500/30"
                }`}
              >
                {isSelectedBlocked ? (
                  <>
                    <Unlock size={13} /> Unblock Date
                  </>
                ) : (
                  <>
                    <Lock size={13} /> Block as Off-Day
                  </>
                )}
              </button>
            </div>

            {isSelectedBlocked ? (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-xs text-red-300 text-center space-y-1">
                <p className="font-bold">Studio Off-Day / Personal Break</p>
                <p className="text-[11px] text-red-300/80">
                  This date is blocked for studio cleaning and personal rest. New booking slots will show as unavailable.
                </p>
              </div>
            ) : dateBookings.length === 0 ? (
              <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-xs text-[#8e90a0] text-center space-y-2">
                <CalendarIcon size={24} className="mx-auto text-[#525463]" />
                <p>No confirmed appointments on this date.</p>
                <p className="text-[11px] text-emerald-400">Slots are available for new inquiries.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#a3a4b2]">
                  Scheduled Appointments ({dateBookings.length})
                </h4>
                {dateBookings.map((b) => (
                  <div
                    key={b.id}
                    className="rounded-xl border border-white/10 bg-[#12141c] p-4 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <strong className="font-serif text-sm text-white">{b.customer_name}</strong>
                      <span className="text-emerald-300 font-semibold">{b.preferred_time}</span>
                    </div>

                    <p className="text-[11px] text-[#8e90a0]">
                      {b.placement} ({b.tattoo_style}) · {b.approx_size}
                    </p>

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-[#747688]">
                      <span>{b.service_type === "home_service" ? "Luxury Home Visit" : "Bhadam Studio"}</span>
                      <span className="text-emerald-400 font-semibold">₹{b.estimated_price}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
