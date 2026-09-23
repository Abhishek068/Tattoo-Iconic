"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  CalendarCheck,
  Clock,
  TrendingUp,
  Users,
  Calendar as CalendarIcon,
  Home,
  MapPin,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Plus,
  Star,
  DollarSign,
  ShieldCheck,
  Instagram,
} from "lucide-react";
import { bookingService } from "@/services/booking.service";
import { portfolioService } from "@/services/portfolio.service";
import { reviewService } from "@/services/review.service";
import { customerService } from "@/services/customer.service";
import type { BookingRequest, PortfolioItem } from "@/types";
import { INITIAL_DASHBOARD_STATS } from "@/data/dashboard";

export default function ArtistDashboardOverviewPage() {
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [portfolioCount, setPortfolioCount] = useState(0);
  const [reviewsCount, setReviewsCount] = useState(0);
  const [customersCount, setCustomersCount] = useState(0);

  useEffect(() => {
    bookingService.getAll().then(setBookings);
    portfolioService.getAll().then((items) => setPortfolioCount(items.length));
    reviewService.getAll().then((revs) => setReviewsCount(revs.length));
    customerService.getAll().then((custs) => setCustomersCount(custs.length));
  }, []);

  const pendingRequests = bookings.filter((b) => b.status === "pending");
  const confirmedSessions = bookings.filter((b) => b.status === "confirmed" || b.status === "accepted");
  const homeServiceCount = bookings.filter((b) => b.service_type === "home_service");

  const totalEstimatedRevenue = bookings.reduce(
    (acc, b) => acc + (b.estimated_price || 0),
    0
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Welcome Banner */}
      <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-r from-[#0c0e14] via-[#141722] to-[#0c0e14] p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <h2 className="font-serif text-2xl sm:text-3xl text-white font-bold tracking-wide">
              Welcome back, Jainik
            </h2>
            <span className="rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-semibold flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Studio Atelier
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#a3a4b2]">
            You have <strong className="text-amber-300 font-semibold">{pendingRequests.length} pending requests</strong> awaiting review and <strong className="text-emerald-300 font-semibold">{confirmedSessions.length} confirmed sessions</strong> scheduled.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/artist-dashboard/bookings"
            className="rounded-xl bg-gradient-to-r from-[#c5a059] to-[#d8b467] text-[#0a0a0a] font-serif font-bold text-xs py-2.5 px-5 shadow-lg shadow-amber-500/20 hover:brightness-110 transition-all uppercase tracking-wider"
          >
            Review Inquiries
          </Link>
          <Link
            href="/artist-dashboard/calendar"
            className="rounded-xl border border-white/10 bg-white/5 text-white text-xs font-semibold py-2.5 px-4 hover:bg-white/10 transition-all"
          >
            Open Calendar
          </Link>
        </div>
      </div>

      {/* 6 KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* 1. Total Inked */}
        <div className="rounded-2xl border border-white/10 bg-[#0d0f14]/80 backdrop-blur-xl p-4 sm:p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#8e90a0] font-medium">Total Tattoos</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-300">
              <Sparkles size={14} />
            </div>
          </div>
          <p className="font-serif text-2xl font-bold text-white">
            {INITIAL_DASHBOARD_STATS.total_tattoos}+
          </p>
          <p className="text-[10px] text-amber-300/80">10+ Years Legacy</p>
        </div>

        {/* 2. Google Sheets Enquiries */}
        <Link
          href="/artist-dashboard/enquiries"
          className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 hover:border-emerald-500/60 transition-all p-4 sm:p-5 space-y-2 block group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-emerald-300 font-medium">New Enquiries</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300">
              <Clock size={14} />
            </div>
          </div>
          <p className="font-serif text-2xl font-bold text-emerald-300">
            {pendingRequests.length + 2}
          </p>
          <p className="text-[10px] text-emerald-400/80 group-hover:underline flex items-center gap-1">
            Google Sheets &rarr;
          </p>
        </Link>

        {/* 3. Upcoming Bookings */}
        <div className="rounded-2xl border border-white/10 bg-[#0d0f14]/80 backdrop-blur-xl p-4 sm:p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#8e90a0] font-medium">Confirmed Slots</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300">
              <CheckCircle2 size={14} />
            </div>
          </div>
          <p className="font-serif text-2xl font-bold text-emerald-300">
            {confirmedSessions.length}
          </p>
          <p className="text-[10px] text-emerald-400/80">Scheduled &amp; ready</p>
        </div>

        {/* 4. Portfolio Works */}
        <div className="rounded-2xl border border-white/10 bg-[#0d0f14]/80 backdrop-blur-xl p-4 sm:p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#8e90a0] font-medium">Portfolio Items</span>
            <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300">
              <Sparkles size={14} />
            </div>
          </div>
          <p className="font-serif text-2xl font-bold text-white">
            {portfolioCount}
          </p>
          <p className="text-[10px] text-[#8e90a0]">Published on website</p>
        </div>

        {/* 5. Client Reviews */}
        <div className="rounded-2xl border border-white/10 bg-[#0d0f14]/80 backdrop-blur-xl p-4 sm:p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#8e90a0] font-medium">Reviews (5.0★)</span>
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
              <Star size={14} />
            </div>
          </div>
          <p className="font-serif text-2xl font-bold text-white">
            {INITIAL_DASHBOARD_STATS.total_reviews}+
          </p>
          <p className="text-[10px] text-emerald-400">99.9% Healed Rate</p>
        </div>

        {/* 6. Estimated Revenue */}
        <div className="rounded-2xl border border-white/10 bg-[#0d0f14]/80 backdrop-blur-xl p-4 sm:p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#8e90a0] font-medium">Pipeline (INR)</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300">
              <TrendingUp size={14} />
            </div>
          </div>
          <p className="font-serif text-2xl font-bold text-white">
            ₹{(totalEstimatedRevenue / 1000).toFixed(0)}k
          </p>
          <p className="text-[10px] text-[#8e90a0]">Current booking pool</p>
        </div>
      </div>

      {/* Main Split Sections */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Recent Inquiries Table */}
        <div className="lg:col-span-8 rounded-2xl border border-white/10 bg-[#0d0f14]/80 backdrop-blur-xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h3 className="font-serif text-lg text-white font-bold">
                Recent Appointment Inquiries
              </h3>
              <p className="text-xs text-[#8e90a0] mt-0.5">
                New concepts submitted via the 7-step booking system
              </p>
            </div>
            <Link
              href="/artist-dashboard/bookings"
              className="text-xs text-amber-300 hover:underline flex items-center gap-1 font-medium"
            >
              View All <ArrowRight size={12} />
            </Link>
          </div>

          <div className="divide-y divide-white/10">
            {bookings.slice(0, 5).map((b) => (
              <div key={b.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-white truncate">
                      {b.customer_name}
                    </p>
                    <span className="text-[10px] rounded-md bg-white/5 border border-white/10 px-2 py-0.5 text-amber-200">
                      {b.tattoo_style}
                    </span>
                    {b.service_type === "home_service" && (
                      <span className="text-[10px] rounded-md bg-amber-500/20 text-amber-300 px-2 py-0.5 font-medium flex items-center gap-1">
                        <Home size={10} /> Home Service
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#8e90a0] truncate max-w-md">
                    {b.placement} · &ldquo;{b.tattoo_description}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <p className="text-xs font-semibold text-white">{b.preferred_date}</p>
                    <span
                      className={`text-[10px] font-medium capitalize rounded-full px-2 py-0.5 block mt-0.5 ${
                        b.status === "confirmed"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : b.status === "pending"
                          ? "bg-amber-500/20 text-amber-300"
                          : b.status === "accepted"
                          ? "bg-blue-500/20 text-blue-300"
                          : "bg-white/10 text-ink-300"
                      }`}
                    >
                      {b.status.replace("_", " ")}
                    </span>
                  </div>

                  <Link
                    href={`/artist-dashboard/bookings?id=${b.id}`}
                    className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white hover:bg-white/10 transition-colors"
                  >
                    Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Upcoming Sessions & Quick Actions */}
        <div className="lg:col-span-4 space-y-6">
          {/* Upcoming Schedule Card */}
          <div className="rounded-2xl border border-white/10 bg-[#0d0f14]/80 backdrop-blur-xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-serif text-lg text-white font-bold">Upcoming Sessions</h3>
              <Link href="/artist-dashboard/calendar" className="text-xs text-amber-300 hover:underline">
                Calendar &rarr;
              </Link>
            </div>

            <div className="space-y-3">
              {confirmedSessions.length === 0 ? (
                <p className="text-xs text-[#8e90a0] py-4 text-center">No confirmed sessions.</p>
              ) : (
                confirmedSessions.slice(0, 3).map((s) => (
                  <div
                    key={s.id}
                    className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3.5 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white">{s.customer_name}</span>
                      <span className="text-emerald-300 font-semibold">{s.preferred_time}</span>
                    </div>
                    <p className="text-[11px] text-[#a3a4b2]">
                      {s.placement} ({s.tattoo_style})
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-[#8e90a0] pt-1">
                      <CalendarIcon size={11} />
                      <span>{s.preferred_date}</span>
                      <span>·</span>
                      <span>{s.service_type === "home_service" ? "Luxury Home Visit" : "Bhadam Studio"}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Hub Shortcuts */}
          <div className="rounded-2xl border border-white/10 bg-[#0d0f14]/80 backdrop-blur-xl p-6 space-y-3">
            <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider">
              Quick Operations
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Link
                href="/artist-dashboard/enquiries"
                className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 hover:border-emerald-400/40 transition-all block space-y-1"
              >
                <TrendingUp size={14} className="text-emerald-400" />
                <p className="font-semibold text-white">Enquiries (Sheets)</p>
                <p className="text-[10px] text-emerald-300/80">View spreadsheet</p>
              </Link>

              <Link
                href="/artist-dashboard/portfolio"
                className="p-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-amber-400/30 transition-all block space-y-1"
              >
                <Plus size={14} className="text-amber-300" />
                <p className="font-semibold text-white">Add Tattoo</p>
                <p className="text-[10px] text-[#8e90a0]">Update portfolio</p>
              </Link>

              <Link
                href="/artist-dashboard/instagram"
                className="p-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-amber-400/30 transition-all block space-y-1"
              >
                <Instagram size={14} className="text-purple-400" />
                <p className="font-semibold text-white">Instagram Hub</p>
                <p className="text-[10px] text-[#8e90a0]">Sync &amp; approve</p>
              </Link>

              <Link
                href="/artist-dashboard/settings"
                className="p-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-amber-400/30 transition-all block space-y-1"
              >
                <ShieldCheck size={14} className="text-blue-400" />
                <p className="font-semibold text-white">Studio Settings</p>
                <p className="text-[10px] text-[#8e90a0]">Lead time &amp; radius</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
