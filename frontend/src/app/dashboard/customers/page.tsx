"use client";

import { useState } from "react";
import { INITIAL_MOCK_CUSTOMERS } from "@/constants";
import type { CustomerRecord } from "@/types";
import { Search, Users, Phone, Mail, MapPin, Sparkles, MessageCircle } from "lucide-react";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerRecord[]>(INITIAL_MOCK_CUSTOMERS);
  const [search, setSearch] = useState("");

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.preferred_style.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl text-white font-bold">
            Customer Directory &amp; History
          </h2>
          <p className="text-xs sm:text-sm text-ink-300 mt-1">
            Access private client records, session histories, and personal session preferences.
          </p>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by customer name, email, style…"
          className="input-field pl-10 text-xs sm:text-sm"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c) => (
          <div
            key={c.id}
            className="glass-card p-6 border-white/15 space-y-4 hover:border-amber-400/30 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-bold text-white">{c.name}</h3>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                    c.status === "vip"
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                      : c.status === "active"
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "bg-white/10 text-ink-300"
                  }`}
                >
                  {c.status}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-ink-300">
                <div className="flex items-center gap-2">
                  <Mail size={13} className="text-ink-400" />
                  <a href={`mailto:${c.email}`} className="hover:underline">{c.email}</a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={13} className="text-ink-400" />
                  <a href={`tel:${c.phone}`} className="hover:underline">{c.phone}</a>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={13} className="text-amber-400" />
                  <span>{c.city}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-ink-400">Total Bookings:</span>
                  <span className="font-bold text-white">{c.total_bookings}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-400">Preferred Style:</span>
                  <span className="font-bold text-amber-300">{c.preferred_style}</span>
                </div>
                <p className="text-[11px] text-ink-400 pt-1 border-t border-white/5 italic">
                  Notes: &ldquo;{c.notes}&rdquo;
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-end">
              <a
                href={`https://wa.me/${c.phone.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-xs py-1.5 px-3 text-emerald-400 inline-flex items-center gap-1.5"
              >
                <MessageCircle size={13} />
                <span>WhatsApp Client</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
