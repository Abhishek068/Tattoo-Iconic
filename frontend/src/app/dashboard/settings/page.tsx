"use client";

import { useState } from "react";
import { ARTIST_PROFILE } from "@/constants";
import { Save, ShieldCheck, Sparkles, Home, DollarSign, Clock } from "lucide-react";
import toast from "react-hot-toast";

export default function StudioSettingsPage() {
  const [name, setName] = useState(ARTIST_PROFILE.full_name);
  const [hourlyRate, setHourlyRate] = useState(ARTIST_PROFILE.hourly_rate);
  const [deposit, setDeposit] = useState(ARTIST_PROFILE.minimum_deposit);
  const [leadDays, setLeadDays] = useState(ARTIST_PROFILE.booking_lead_days);
  const [homeServiceRadius, setHomeServiceRadius] = useState(ARTIST_PROFILE.home_service_radius);
  const [bio, setBio] = useState(ARTIST_PROFILE.bio);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    toast.success("Studio settings updated successfully!");
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="font-display text-2xl sm:text-3xl text-white font-bold">
          Studio &amp; Artist Settings
        </h2>
        <p className="text-xs sm:text-sm text-ink-300 mt-1">
          Configure appointment parameters, minimum deposit rates, and home service logistics.
        </p>
      </div>

      <form onSubmit={handleSave} className="glass-card p-6 sm:p-8 space-y-6 border-white/15">
        {/* Profile Info */}
        <div className="space-y-4">
          <h3 className="font-display text-lg text-white font-bold border-b border-white/10 pb-2">
            Artist Identity
          </h3>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Full Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Studio Brand Title</label>
              <input
                defaultValue="Jainik Patel Tattoo Atelier"
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="label">Artist Biography &amp; Philosophy</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="input-field"
            />
          </div>
        </div>

        {/* Pricing & Deposit Rules */}
        <div className="space-y-4 pt-4 border-t border-white/10">
          <h3 className="font-display text-lg text-white font-bold border-b border-white/10 pb-2">
            Pricing &amp; Deposit Configurations
          </h3>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="label">Hourly Rate (₹ INR)</label>
              <input
                type="number"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
                className="input-field"
              />
            </div>

            <div>
              <label className="label">Minimum Deposit (₹ INR)</label>
              <input
                type="number"
                value={deposit}
                onChange={(e) => setDeposit(Number(e.target.value))}
                className="input-field"
              />
            </div>

            <div>
              <label className="label">Booking Lead Time (Days)</label>
              <input
                type="number"
                value={leadDays}
                onChange={(e) => setLeadDays(Number(e.target.value))}
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Home Service Logistics */}
        <div className="space-y-4 pt-4 border-t border-white/10">
          <h3 className="font-display text-lg text-white font-bold border-b border-white/10 pb-2">
            Luxury Home Service Terms
          </h3>

          <div>
            <label className="label">Service Radius &amp; Travel Policy</label>
            <input
              value={homeServiceRadius}
              onChange={(e) => setHomeServiceRadius(e.target.value)}
              className="input-field"
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button type="submit" className="btn-primary text-xs sm:text-sm py-3 px-8 flex items-center gap-2">
            <Save size={16} />
            <span>Save Studio Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
