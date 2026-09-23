"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Star,
  ShieldCheck,
  CheckCircle2,
  Eye,
  EyeOff,
  Trash2,
  MapPin,
  Calendar,
  Home,
  Sparkles,
  Plus,
  X,
} from "lucide-react";
import { reviewService } from "@/services/review.service";
import type { ReviewItem } from "@/types";
import toast from "react-hot-toast";

export default function ArtistReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [filterType, setFilterType] = useState("All");

  const loadData = () => {
    reviewService.getAll(filterType).then(setReviews);
  };

  useEffect(() => {
    loadData();
  }, [filterType]);

  async function handleToggleVerify(id: string) {
    const updated = await reviewService.toggleVerify(id);
    if (updated) {
      toast.success(updated.is_verified ? "Review verified with badge" : "Verification removed");
      loadData();
    }
  }

  async function handleToggleHide(id: string) {
    const updated = await reviewService.toggleHide(id);
    if (updated) {
      toast.success(updated.is_hidden ? "Review hidden from public site" : "Review visible on public site");
      loadData();
    }
  }

  async function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this client review?")) {
      await reviewService.delete(id);
      toast.success("Review deleted.");
      loadData();
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl text-white font-bold tracking-wide">
            Client Reviews &amp; Testimonials
          </h2>
          <p className="text-xs sm:text-sm text-[#8e90a0] mt-1">
            Manage collector feedback, verified healed photos, and public ratings showcase.
          </p>
        </div>

        {/* Stats Summary Pill */}
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-3.5 py-1.5 text-xs text-amber-300 font-semibold flex items-center gap-1.5">
            <Star size={14} className="fill-amber-300" />
            <span>5.0 Rating (460+ Verified)</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {["All", "Studio Visit", "Home Service", "Custom Project"].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`rounded-xl px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all ${
              filterType === type
                ? "bg-[#c5a059] text-black font-bold"
                : "border border-white/10 bg-white/5 text-[#8e90a0] hover:text-white"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Reviews Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className={`rounded-2xl border p-6 space-y-4 transition-all flex flex-col justify-between ${
              rev.is_hidden
                ? "border-white/5 bg-white/[0.02] opacity-50"
                : "border-white/10 bg-[#0d0f14]/80 hover:border-amber-400/30"
            }`}
          >
            <div className="space-y-3">
              {/* Rating & Action Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleToggleVerify(rev.id)}
                    className={`p-1.5 rounded-lg border transition-colors ${
                      rev.is_verified
                        ? "border-emerald-500/30 bg-emerald-500/20 text-emerald-300"
                        : "border-white/10 bg-white/5 text-[#8e90a0]"
                    }`}
                    title="Toggle Verified Badge"
                  >
                    <ShieldCheck size={14} />
                  </button>

                  <button
                    onClick={() => handleToggleHide(rev.id)}
                    className={`p-1.5 rounded-lg border transition-colors ${
                      rev.is_hidden
                        ? "border-red-500/30 bg-red-500/20 text-red-300"
                        : "border-white/10 bg-white/5 text-[#8e90a0] hover:text-white"
                    }`}
                    title={rev.is_hidden ? "Show Review" : "Hide Review"}
                  >
                    {rev.is_hidden ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>

                  <button
                    onClick={() => handleDelete(rev.id)}
                    className="p-1.5 rounded-lg border border-white/10 bg-white/5 text-red-400 hover:bg-red-500/20 transition-colors"
                    title="Delete Review"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Client & Piece Title */}
              <div>
                <h3 className="font-serif text-base font-bold text-white">
                  {rev.client_name}
                </h3>
                <p className="text-[11px] text-amber-300 font-medium">
                  {rev.tattoo_piece} ({rev.style})
                </p>
                <div className="flex items-center gap-2 text-[10px] text-[#747688] pt-0.5">
                  <span>{rev.client_location}</span>
                  <span>·</span>
                  <span>{rev.service_type}</span>
                </div>
              </div>

              {/* Review Body */}
              <p className="text-xs text-[#cacad3] leading-relaxed italic">
                &ldquo;{rev.comment}&rdquo;
              </p>

              {/* Healed Photo Attachment */}
              {rev.healed_photo && (
                <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-[#12141c]">
                  <Image
                    src={rev.healed_photo}
                    alt={rev.tattoo_piece}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-2 left-2 rounded-md bg-black/70 backdrop-blur-md px-2 py-0.5 text-[9px] font-semibold text-emerald-300 border border-emerald-500/30">
                    {rev.healed_time || "Healed Result"}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-[#747688]">
              <span>{rev.created_at}</span>
              <span>{rev.is_verified ? "Verified Client" : "Unverified"}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
