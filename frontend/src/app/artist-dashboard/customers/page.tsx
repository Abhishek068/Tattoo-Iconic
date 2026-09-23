"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Search,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  MessageCircle,
  Star,
  Plus,
  Edit2,
  Calendar,
} from "lucide-react";
import { customerService } from "@/services/customer.service";
import type { CustomerRecord } from "@/types";
import toast from "react-hot-toast";

export default function ArtistCustomersPage() {
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [search, setSearch] = useState("");

  const loadData = () => {
    customerService.getAll(search).then(setCustomers);
  };

  useEffect(() => {
    loadData();
  }, [search]);

  async function handleToggleVip(c: CustomerRecord) {
    const newStatus = c.status === "vip" ? "active" : "vip";
    await customerService.update(c.id, { status: newStatus });
    toast.success(`${c.name} marked as ${newStatus.toUpperCase()}`);
    loadData();
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl text-white font-bold tracking-wide">
            Collector &amp; Client Directory
          </h2>
          <p className="text-xs sm:text-sm text-[#8e90a0] mt-1">
            Access private client records, session frequencies, VIP tiers, and anatomical preferences.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-[#a3a4b2]">
            Total Inked Clients: <strong className="text-white">{customers.length}</strong>
          </span>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8e90a0]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by customer name, city, preferred style, or phone..."
          className="w-full rounded-xl border border-white/10 bg-[#0d0f14]/80 pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-[#525463] focus:border-amber-400 focus:outline-none"
        />
      </div>

      {/* Customers Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {customers.map((c) => (
          <div
            key={c.id}
            className="rounded-2xl border border-white/10 bg-[#0d0f14]/80 backdrop-blur-xl p-6 space-y-4 hover:border-amber-400/40 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Header with Name & VIP Badge */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-serif text-lg font-bold text-white">{c.name}</h3>
                  <p className="text-xs text-[#8e90a0] flex items-center gap-1 mt-0.5">
                    <MapPin size={11} className="text-amber-400" /> {c.city}
                  </p>
                </div>

                <button
                  onClick={() => handleToggleVip(c)}
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase transition-all cursor-pointer ${
                    c.status === "vip"
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                      : c.status === "active"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-white/10 text-ink-300 border border-white/10"
                  }`}
                  title="Click to toggle VIP status"
                >
                  {c.status}
                </button>
              </div>

              {/* Style & Booking Stats */}
              <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                <div className="rounded-xl border border-white/5 bg-[#12141c] p-2.5">
                  <span className="block text-[10px] text-[#525463] uppercase font-semibold">
                    Total Bookings
                  </span>
                  <strong className="text-white font-serif text-base">{c.total_bookings}</strong>
                </div>

                <div className="rounded-xl border border-white/5 bg-[#12141c] p-2.5">
                  <span className="block text-[10px] text-[#525463] uppercase font-semibold">
                    Preferred Style
                  </span>
                  <strong className="text-amber-300 text-xs truncate block">{c.preferred_style}</strong>
                </div>
              </div>

              {/* Private Notes */}
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 text-xs text-[#cacad3] space-y-1">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-[#525463]">
                  Collector Notes
                </span>
                <p className="text-[11px] text-[#a3a4b2] leading-relaxed italic">
                  &ldquo;{c.notes}&rdquo;
                </p>
              </div>
            </div>

            {/* Direct Connect Buttons */}
            <div className="pt-4 border-t border-white/5 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`https://wa.me/${c.phone.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20 transition-colors flex items-center justify-center gap-1.5"
                >
                  <MessageCircle size={13} /> WhatsApp
                </a>

                <a
                  href={`tel:${c.phone.replace(/\s+/g, "")}`}
                  className="rounded-xl border border-white/10 bg-white/5 py-2 text-xs font-semibold text-white hover:bg-white/10 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Phone size={13} /> Call
                </a>
              </div>

              <div className="flex items-center justify-between text-[10px] text-[#747688] pt-1">
                <span>{c.email}</span>
                <span>Last: {c.last_booking_date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
