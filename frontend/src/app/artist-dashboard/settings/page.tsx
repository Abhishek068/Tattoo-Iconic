"use client";

import { useState } from "react";
import { ARTIST_PROFILE } from "@/constants";
import {
  Save,
  ShieldCheck,
  Sparkles,
  Home,
  DollarSign,
  Clock,
  Lock,
  CheckCircle2,
  KeyRound,
} from "lucide-react";
import toast from "react-hot-toast";

export default function ArtistSettingsPage() {
  const [name, setName] = useState(ARTIST_PROFILE.full_name);
  const [hourlyRate, setHourlyRate] = useState(ARTIST_PROFILE.hourly_rate);
  const [deposit, setDeposit] = useState(ARTIST_PROFILE.minimum_deposit);
  const [leadDays, setLeadDays] = useState(ARTIST_PROFILE.booking_lead_days);
  const [homeServiceRadius, setHomeServiceRadius] = useState(ARTIST_PROFILE.home_service_radius);
  const [bio, setBio] = useState(ARTIST_PROFILE.bio);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    toast.success("Studio & Artist settings updated successfully!");
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="font-serif text-2xl sm:text-3xl text-white font-bold tracking-wide">
          Studio &amp; Artist Settings
        </h2>
        <p className="text-xs sm:text-sm text-[#8e90a0] mt-1">
          Configure appointment parameters, minimum deposit rates, security settings, and home service logistics.
        </p>
      </div>

      <form onSubmit={handleSave} className="rounded-2xl border border-white/10 bg-[#0d0f14]/80 backdrop-blur-xl p-6 sm:p-8 space-y-6">
        {/* Profile Info */}
        <div className="space-y-4">
          <h3 className="font-serif text-base font-bold text-white border-b border-white/10 pb-2 flex items-center gap-2">
            <Sparkles size={16} className="text-amber-300" />
            <span>Artist Identity &amp; Atelier Brand</span>
          </h3>

          <div className="grid sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[#cacad3] font-semibold mb-1">Full Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white focus:border-amber-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[#cacad3] font-semibold mb-1">Studio Brand Title</label>
              <input
                defaultValue="Tattoo Iconic — Jainik Patel Master Atelier"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block text-[#cacad3] font-semibold mb-1">Artist Biography &amp; Philosophy</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white focus:border-amber-400 focus:outline-none leading-relaxed"
            />
          </div>
        </div>

        {/* Pricing & Deposit Rules */}
        <div className="space-y-4 pt-4 border-t border-white/10">
          <h3 className="font-serif text-base font-bold text-white border-b border-white/10 pb-2 flex items-center gap-2">
            <DollarSign size={16} className="text-emerald-400" />
            <span>Pricing &amp; Deposit Rules</span>
          </h3>

          <div className="grid sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-[#cacad3] font-semibold mb-1">Hourly Rate (₹ INR)</label>
              <input
                type="number"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white focus:border-amber-400 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-[#cacad3] font-semibold mb-1">Minimum Deposit (₹ INR)</label>
              <input
                type="number"
                value={deposit}
                onChange={(e) => setDeposit(Number(e.target.value))}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white focus:border-amber-400 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-[#cacad3] font-semibold mb-1">Booking Lead Time (Days)</label>
              <input
                type="number"
                value={leadDays}
                onChange={(e) => setLeadDays(Number(e.target.value))}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white focus:border-amber-400 focus:outline-none font-mono"
              />
            </div>
          </div>
        </div>

        {/* Home Service Logistics */}
        <div className="space-y-4 pt-4 border-t border-white/10">
          <h3 className="font-serif text-base font-bold text-white border-b border-white/10 pb-2 flex items-center gap-2">
            <Home size={16} className="text-amber-300" />
            <span>Luxury Doorstep Inking Logistics</span>
          </h3>

          <div className="text-xs">
            <label className="block text-[#cacad3] font-semibold mb-1">Service Radius &amp; Travel Policy</label>
            <input
              value={homeServiceRadius}
              onChange={(e) => setHomeServiceRadius(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white focus:border-amber-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Security Info */}
        <div className="space-y-3 pt-4 border-t border-white/10">
          <h3 className="font-serif text-base font-bold text-white border-b border-white/10 pb-2 flex items-center gap-2">
            <KeyRound size={16} className="text-blue-400" />
            <span>Dashboard Security &amp; Access Controls</span>
          </h3>

          <div className="rounded-xl border border-white/10 bg-[#12141c] p-4 text-xs space-y-2 text-[#8e90a0]">
            <div className="flex items-center justify-between">
              <span>Security Key Architecture:</span>
              <strong className="text-emerald-400">Server-Side Next.js Key Guard</strong>
            </div>
            <div className="flex items-center justify-between">
              <span>Session Expiration Duration:</span>
              <strong className="text-white">8 Hours (HMAC-SHA256 Signed Token)</strong>
            </div>
            <div className="flex items-center justify-between">
              <span>Cookie Policy:</span>
              <strong className="text-white">HttpOnly, SameSite=Lax, Secure in Production</strong>
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="rounded-xl bg-gradient-to-r from-[#c5a059] to-[#d8b467] py-3 px-8 text-xs font-bold text-[#0a0a0a] uppercase tracking-wider hover:brightness-110 transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
          >
            <Save size={16} />
            <span>Save Studio Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
