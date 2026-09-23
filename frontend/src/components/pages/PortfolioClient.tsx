"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { portfolioService } from "@/services/portfolioService";
import { inspirationService } from "@/services/inspirationService";
import { MoodboardDrawer } from "@/components/portfolio/MoodboardDrawer";
import type { PortfolioItem, MoodboardItem } from "@/types";
import {
  Search,
  Sparkles,
  X,
  Instagram,
  Heart,
  MessageCircle,
} from "lucide-react";
import { ARTIST_PROFILE } from "@/constants";
import toast from "react-hot-toast";
import { LusionSpotlightCard } from "@/components/ui/LusionEffects";

const STYLES = [
  "All",
  "Spiritual",
  "Fine Line",
  "Realism",
  "Minimalist",
  "Geometric",
  "Script",
  "Traditional",
  "Cover-up",
  "Custom",
];

const PLACEMENTS = [
  "All",
  "Forearm",
  "Full Sleeve",
  "Bicep",
  "Shoulder",
  "Spine",
  "Chest",
  "Wrist",
  "Collarbone",
  "Thigh",
];

export function PortfolioClient() {
  const [activeTab, setActiveTab] = useState<"masterpieces" | "moodboard">("masterpieces");
  const [masterpieces, setMasterpieces] = useState<PortfolioItem[]>([]);
  const [activeLightboxPiece, setActiveLightboxPiece] = useState<PortfolioItem | null>(null);

  const [moodboardItems, setMoodboardItems] = useState<MoodboardItem[]>([]);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const [selectedStyle, setSelectedStyle] = useState("All");
  const [selectedPlacement, setSelectedPlacement] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    portfolioService
      .getPortfolio({
        style: selectedStyle,
        placement: selectedPlacement,
        search,
      })
      .then(setMasterpieces);

    const mb = inspirationService.getMoodboard();
    setMoodboardItems(mb);
    setSavedIds(new Set(mb.map((m) => m.item_id)));
  }, [selectedStyle, selectedPlacement, search]);

  const handleToggleSave = (item: PortfolioItem) => {
    const res = inspirationService.toggleMoodboardItem({
      id: item.id,
      title: item.title,
      image: item.image,
      style: item.primary_style || "Custom",
      placement: item.placement,
      source: "studio",
    });

    const updated = inspirationService.getMoodboard();
    setMoodboardItems(updated);
    setSavedIds(new Set(updated.map((m) => m.item_id)));

    if (res.isSaved) {
      toast.success(`Saved "${item.title}" to your Moodboard!`);
    } else {
      toast("Removed from Moodboard", { icon: "🗑️" });
    }
  };

  const handleRemoveFromMoodboard = (itemId: string) => {
    inspirationService.toggleMoodboardItem({ id: itemId } as any);
    const updated = inspirationService.getMoodboard();
    setMoodboardItems(updated);
    setSavedIds(new Set(updated.map((m) => m.item_id)));
  };

  const handleClearMoodboard = () => {
    inspirationService.clearMoodboard();
    setMoodboardItems([]);
    setSavedIds(new Set());
    toast.success("Moodboard cleared");
  };

  return (
    <>
      <Navbar />

      <main className="container-hero pt-28 sm:pt-36 pb-16 sm:pb-20 min-h-screen">
        {/* ── Page Header ── */}
        <div className="max-w-3xl">
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white font-bold leading-tight">
            Tattoo Portfolio &amp; Masterpieces
          </h1>
          <p className="text-sm sm:text-base text-ink-300 mt-2.5 leading-relaxed">
            Explore Jainik Patel&apos;s authentic bespoke tattoo masterworks, filter by style and placement, or book your custom consultation on WhatsApp.
          </p>
        </div>

        {/* ── Navigation Tabs ── */}
        <div className="mt-8 flex flex-wrap gap-2 sm:gap-3 border-b border-white/10 pb-4">
          <button
            onClick={() => setActiveTab("masterpieces")}
            className={`rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${activeTab === "masterpieces"
                ? "bg-brand text-white shadow-lg shadow-brand/25 scale-[1.02]"
                : "border border-white/10 bg-white/5 text-ink-300 hover:border-white/20 hover:text-white"
              }`}
          >
            <Sparkles size={15} />
            <span>👑 Jainik&apos;s Masterpieces</span>
            <span className="rounded-full bg-black/20 px-2 py-0.5 text-[10px]">
              {masterpieces.length}
            </span>
          </button>

          {moodboardItems.length > 0 && (
            <button
              onClick={() => setActiveTab("moodboard")}
              className={`rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${activeTab === "moodboard"
                  ? "bg-red-500 text-white shadow-lg shadow-red-500/20 scale-[1.02]"
                  : "border border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20"
                }`}
            >
              <Heart size={15} className="fill-red-400 text-red-400" />
              <span>💖 My Moodboard ({moodboardItems.length})</span>
            </button>
          )}
        </div>

        {/* ── Search & Filter Bar ── */}
        {activeTab !== "moodboard" && (
          <div className="mt-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 max-w-md">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search motifs (e.g. Shiva, Hanuman, Lion, Lotus, Mandala, Feather)..."
                  className="input-field pl-10 text-xs"
                />
              </div>

              {(selectedStyle !== "All" || selectedPlacement !== "All" || search) && (
                <button
                  onClick={() => {
                    setSelectedStyle("All");
                    setSelectedPlacement("All");
                    setSearch("");
                  }}
                  className="btn-secondary text-xs py-2.5 px-4 self-start"
                >
                  Reset All Filters
                </button>
              )}
            </div>

            {/* Style Filters */}
            <div className="flex flex-wrap gap-2 pt-1">
              {STYLES.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedStyle(s)}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold tracking-wide transition-all cursor-pointer ${selectedStyle === s
                      ? "bg-amber-500 text-ink-950 font-bold shadow-md shadow-amber-500/20 scale-105"
                      : "border border-white/10 bg-white/5 text-ink-300 hover:border-white/20 hover:text-white"
                    }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Placement Filters */}
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {PLACEMENTS.map((p) => (
                <button
                  key={p}
                  onClick={() => setSelectedPlacement(p)}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition-all cursor-pointer ${selectedPlacement === p
                      ? "border border-amber-500/50 bg-amber-500/20 text-amber-200"
                      : "border border-white/5 bg-ink-900/60 text-ink-400 hover:text-ink-200"
                    }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════ */}
        {/* VIEW 1: Jainik's Masterpiece Portfolio */}
        {/* ═════════════════════════════════════════════════════════════ */}
        {activeTab === "masterpieces" && (
          <div className="mt-8">
            {masterpieces.length === 0 ? (
              <div className="py-20 text-center text-ink-400">
                <p className="text-base font-medium text-white">No masterpiece pieces found</p>
                <p className="text-xs mt-1">Try resetting your filters.</p>
              </div>
            ) : (
              <motion.div layout className="grid gap-4 sm:gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                {masterpieces.map((item, i) => {
                  const isSaved = savedIds.has(item.id);

                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, delay: (i % 9) * 0.04 }}
                    >
                      <LusionSpotlightCard
                        onClick={() => setActiveLightboxPiece(item)}
                        tiltStrength={6}
                        className="group cursor-pointer aspect-square rounded-2xl overflow-hidden border border-white/10 bg-ink-900 shadow-xl hover:border-amber-500/50 hover:shadow-amber-500/10 hover:shadow-2xl transition-all duration-500 relative"
                      >
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between pointer-events-none">
                          <span className="inline-flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 px-2.5 py-1 text-[10px] font-bold text-white shadow-md">
                            <Instagram size={11} className="text-pink-400" />
                            <span>@tatoo.iconic</span>
                          </span>

                          {/* Top Bookmark */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleSave(item);
                            }}
                            className={`h-8 w-8 rounded-full flex items-center justify-center backdrop-blur-md border transition-all pointer-events-auto cursor-pointer ${isSaved
                                ? "bg-red-500 border-red-400 text-white"
                                : "bg-ink-950/80 border-white/20 text-white hover:bg-red-500"
                              }`}
                          >
                            <Heart size={14} className={isSaved ? "fill-white" : ""} />
                          </button>
                        </div>

                        {/* Bottom Gradient Metadata Overlay */}
                        <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3.5 pt-8 text-left opacity-90 group-hover:opacity-100 transition-opacity">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="rounded-md bg-amber-500/20 border border-amber-500/40 px-1.5 py-0.5 text-[9px] font-bold text-amber-300">
                              {item.primary_style || "Custom"}
                            </span>
                            <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[9px] text-ink-300 font-medium">
                              {item.placement}
                            </span>
                          </div>
                          <p className="font-bold text-xs text-white truncate group-hover:text-amber-300 transition-colors">
                            {item.title}
                          </p>
                        </div>
                      </LusionSpotlightCard>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════ */}
        {/* VIEW 2: My Moodboard Collection */}
        {/* ═════════════════════════════════════════════════════════════ */}
        {activeTab === "moodboard" && (
          <div className="mt-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl border border-red-500/30 bg-red-500/10">
              <div>
                <h3 className="font-display text-2xl text-white font-bold">
                  Your Curated Reference Board ({moodboardItems.length})
                </h3>
                <p className="text-xs text-ink-300 mt-1">
                  Send these saved tattoos directly to Jainik Patel for design customization and instant pricing.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleClearMoodboard}
                  className="btn-secondary text-xs py-2.5 px-4"
                >
                  Clear Board
                </button>
                <a
                  href={`https://wa.me/${ARTIST_PROFILE.whatsapp_number.replace(
                    /[^0-9]/g,
                    ""
                  )}?text=Hello%20Jainik%20bhai,%20I%20have%20saved%20${moodboardItems.length
                    }%20tattoo%20references%20on%20your%20website%20moodboard%20and%20want%20to%20inquire!`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 px-4 flex items-center gap-2 shadow-lg shadow-emerald-600/30"
                >
                  <MessageCircle size={15} />
                  <span>Send Board to WhatsApp</span>
                </a>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {moodboardItems.map((mb) => (
                <div
                  key={mb.id}
                  className="rounded-2xl border border-white/10 bg-ink-900 p-3 flex flex-col justify-between"
                >
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-ink-950">
                    <Image src={mb.image} alt={mb.title} fill className="object-cover" />
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="truncate pr-2">
                      <p className="font-bold text-white text-xs truncate">{mb.title}</p>
                      <p className="text-[10px] text-ink-400">{mb.placement}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveFromMoodboard(mb.item_id)}
                      className="text-xs text-red-400 hover:underline shrink-0"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Sticky Moodboard Floating Action Bar ── */}
        <MoodboardDrawer
          items={moodboardItems}
          onRemove={handleRemoveFromMoodboard}
          onClear={handleClearMoodboard}
        />

        {/* ── Masterpiece Lightbox Inspection Modal ── */}
        <AnimatePresence>
          {activeLightboxPiece && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl">
              <motion.div
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                className="relative w-full max-w-4xl max-h-[90vh] rounded-3xl border border-white/15 bg-ink-950 shadow-2xl overflow-hidden flex flex-col md:flex-row"
              >
                <button
                  onClick={() => setActiveLightboxPiece(null)}
                  className="absolute top-4 right-4 z-20 h-9 w-9 rounded-full bg-ink-950/80 border border-white/20 text-white flex items-center justify-center backdrop-blur-md"
                >
                  <X size={18} />
                </button>

                <div className="relative md:w-3/5 bg-ink-950 aspect-[4/5] md:aspect-auto min-h-[350px]">
                  <Image
                    src={activeLightboxPiece.image}
                    alt={activeLightboxPiece.title}
                    fill
                    priority
                    className="object-contain"
                  />
                </div>

                <div className="p-6 md:p-8 md:w-2/5 flex flex-col justify-between overflow-y-auto bg-ink-900/60 border-t md:border-t-0 md:border-l border-white/10">
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-1.5">
                      {activeLightboxPiece.style_tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-md bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold text-amber-200"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <h2 className="font-display text-2xl font-bold text-white">
                      {activeLightboxPiece.title}
                    </h2>

                    <p className="text-xs text-ink-300 leading-relaxed">
                      {activeLightboxPiece.description}
                    </p>

                    <div className="rounded-xl border border-white/10 bg-white/5 p-3 space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-ink-400">Placement:</span>
                        <span className="font-semibold text-white">
                          {activeLightboxPiece.placement}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-ink-400">Color Palette:</span>
                        <span className="font-semibold text-white">
                          {activeLightboxPiece.color_type}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-ink-400">Estimated Duration:</span>
                        <span className="font-semibold text-amber-300">
                          {activeLightboxPiece.session_hours
                            ? `${activeLightboxPiece.session_hours} hrs`
                            : "Custom Session"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10 space-y-2.5">
                    <button
                      onClick={() => handleToggleSave(activeLightboxPiece)}
                      className={`w-full rounded-xl py-3 text-xs font-bold flex items-center justify-center gap-2 ${savedIds.has(activeLightboxPiece.id)
                          ? "bg-red-500/20 text-red-300 border border-red-500/40"
                          : "bg-white/10 hover:bg-white/15 text-white"
                        }`}
                    >
                      <Heart
                        size={15}
                        className={savedIds.has(activeLightboxPiece.id) ? "fill-red-400" : ""}
                      />
                      <span>
                        {savedIds.has(activeLightboxPiece.id)
                          ? "Saved in Moodboard"
                          : "Save to Moodboard"}
                      </span>
                    </button>

                    <a
                      href={`https://wa.me/${ARTIST_PROFILE.whatsapp_number.replace(
                        /[^0-9]/g,
                        ""
                      )}?text=Hello%20Jainik%20bhai,%20I%20am%20interested%20in%20this%20masterpiece:%20${encodeURIComponent(
                        activeLightboxPiece.title
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white py-3.5 text-xs font-bold flex items-center justify-center gap-2"
                    >
                      <MessageCircle size={16} />
                      <span>Inquire Master Session on WhatsApp</span>
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </>
  );
}
