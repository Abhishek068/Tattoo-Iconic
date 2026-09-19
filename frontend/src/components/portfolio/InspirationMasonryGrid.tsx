"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Sparkles,
  Maximize2,
  X,
  ArrowRight,
  MessageCircle,
  ExternalLink,
  Instagram,
  Check,
  Share2,
} from "lucide-react";
import type { InspirationItem } from "@/types";
import { ARTIST_PROFILE } from "@/constants";
import toast from "react-hot-toast";

interface Props {
  items: InspirationItem[];
  savedIds: Set<string>;
  onToggleSave: (item: InspirationItem) => void;
}

export function InspirationMasonryGrid({ items, savedIds, onToggleSave }: Props) {
  const [activePiece, setActivePiece] = useState<InspirationItem | null>(null);

  const handleShare = (piece: InspirationItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator
        .share({
          title: piece.title,
          text: `Check out this tattoo inspiration: ${piece.title} at Tattoo Iconic`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/portfolio?ref=${piece.id}`);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <>
      {/* ── Pinterest-Style Masonry Grid ── */}
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 sm:gap-6 space-y-4 sm:space-y-6">
        {items.map((piece, i) => {
          const isSaved = savedIds.has(piece.id);

          return (
            <motion.div
              key={piece.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.45, delay: (i % 12) * 0.03 }}
              className="break-inside-avoid group relative rounded-2xl overflow-hidden border border-white/10 bg-ink-900 shadow-xl hover:border-amber-500/40 hover:shadow-2xl transition-all duration-300"
            >
              <div
                onClick={() => setActivePiece(piece)}
                className="relative cursor-pointer overflow-hidden bg-ink-950"
              >
                {/* Image with dynamic aspect height */}
                <div
                  className={`relative w-full ${
                    piece.aspect_ratio === "tall"
                      ? "aspect-[9/16]"
                      : piece.aspect_ratio === "portrait"
                      ? "aspect-[3/4]"
                      : piece.aspect_ratio === "wide"
                      ? "aspect-[16/10]"
                      : "aspect-square"
                  }`}
                >
                  <Image
                    src={piece.image}
                    alt={piece.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>

                {/* Bookmark / Heart Button */}
                <div className="absolute top-3 right-3 z-10">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleSave(piece);
                    }}
                    aria-label="Save to Moodboard"
                    className={`h-8 w-8 rounded-full flex items-center justify-center backdrop-blur-md border transition-all duration-300 shadow-xl cursor-pointer ${
                      isSaved
                        ? "bg-red-500 border-red-400 text-white scale-110"
                        : "bg-ink-950/80 border-white/20 text-white/80 hover:bg-red-500/80 hover:text-white hover:border-red-400"
                    }`}
                  >
                    <Heart size={15} className={isSaved ? "fill-white" : ""} />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── High-Resolution Lightbox Inspection Modal ── */}
      <AnimatePresence>
        {activePiece && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-4xl max-h-[92vh] rounded-3xl border border-white/15 bg-ink-950 shadow-2xl overflow-hidden flex flex-col md:flex-row"
            >
              {/* Close Button */}
              <button
                onClick={() => setActivePiece(null)}
                className="absolute top-4 right-4 z-20 h-9 w-9 rounded-full bg-ink-950/80 border border-white/20 text-ink-200 hover:text-white hover:bg-white/10 flex items-center justify-center backdrop-blur-md transition-colors"
              >
                <X size={18} />
              </button>

              {/* Left Column: Big Image Display */}
              <div className="relative md:w-3/5 bg-ink-950 aspect-[4/5] md:aspect-auto min-h-[360px] md:min-h-[550px] overflow-hidden">
                <Image
                  src={activePiece.image}
                  alt={activePiece.title}
                  fill
                  priority
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 60vw"
                />

                {/* Top Source Chip */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="rounded-full bg-ink-950/85 border border-white/20 px-3 py-1 text-xs font-semibold text-amber-300 backdrop-blur-md">
                    {activePiece.source === "studio"
                      ? "👑 Master Studio Piece"
                      : activePiece.source === "instagram"
                      ? "📸 Instagram Post"
                      : "📌 Pinterest Inspiration"}
                  </span>
                </div>
              </div>

              {/* Right Column: Piece Details & Booking Action */}
              <div className="p-6 md:p-8 md:w-2/5 flex flex-col justify-between overflow-y-auto bg-ink-900/60 border-t md:border-t-0 md:border-l border-white/10">
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-1.5">
                    {activePiece.style_tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-md bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold text-amber-200"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <h2 className="font-display text-2xl sm:text-3xl text-white font-bold">
                    {activePiece.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-ink-300 leading-relaxed">
                    {activePiece.description}
                  </p>

                  {/* Metadata Specs */}
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-ink-400">Primary Placement:</span>
                      <span className="font-semibold text-white">{activePiece.placement}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ink-400">Artistic Style:</span>
                      <span className="font-semibold text-amber-300">
                        {activePiece.primary_style}
                      </span>
                    </div>
                    {activePiece.artist_credit && (
                      <div className="flex justify-between">
                        <span className="text-ink-400">Master Artist:</span>
                        <span className="font-semibold text-white">
                          {activePiece.artist_credit}
                        </span>
                      </div>
                    )}
                    {activePiece.instagram_likes && (
                      <div className="flex justify-between">
                        <span className="text-ink-400">Instagram Engagement:</span>
                        <span className="font-semibold text-fuchsia-300">
                          ♥ {activePiece.instagram_likes} likes
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 pt-4 border-t border-white/10 space-y-2.5">
                  <button
                    onClick={() => {
                      onToggleSave(activePiece);
                    }}
                    className={`w-full rounded-xl py-3 px-4 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      savedIds.has(activePiece.id)
                        ? "bg-red-500/20 text-red-300 border border-red-500/40"
                        : "bg-white/10 hover:bg-white/15 text-white border border-white/15"
                    }`}
                  >
                    <Heart
                      size={15}
                      className={savedIds.has(activePiece.id) ? "fill-red-400 text-red-400" : ""}
                    />
                    <span>
                      {savedIds.has(activePiece.id)
                        ? "Saved in Your Moodboard"
                        : "Save to My Tattoo Moodboard"}
                    </span>
                  </button>

                  <a
                    href={`https://wa.me/${ARTIST_PROFILE.whatsapp_number.replace(
                      /[^0-9]/g,
                      ""
                    )}?text=Hello%20Jainik%20bhai,%20I%20am%20interested%20in%20getting%20this%20tattoo:%20${encodeURIComponent(
                      activePiece.title
                    )}%20(${encodeURIComponent(activePiece.image)})`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white py-3.5 px-4 text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-600/30"
                  >
                    <MessageCircle size={16} />
                    <span>Inquire this Piece on WhatsApp</span>
                  </a>

                  <Link
                    href={`/booking?style=${encodeURIComponent(
                      activePiece.primary_style
                    )}&placement=${encodeURIComponent(activePiece.placement)}`}
                    onClick={() => setActivePiece(null)}
                    className="btn-primary w-full py-3 text-xs font-bold text-center"
                  >
                    Book Appointment for this Style &rarr;
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
