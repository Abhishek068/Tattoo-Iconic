"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Search,
  ShieldCheck,
  Zap,
  ArrowRight,
  MessageCircle,
  X,
  Compass,
  Layers,
  Activity,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TATTOO_STYLES_CATALOG, ARTIST_PROFILE } from "@/constants";
import { LusionSpotlightCard } from "@/components/ui/LusionEffects";
import type { TattooStyleCatalogItem } from "@/types";

const CATEGORIES = [
  "All Styles",
  "Spiritual & Cultural",
  "Precision & Micro",
  "Realism & Blackwork",
  "Contemporary & Illustrative",
] as const;

export function StylesClient() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All Styles");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStyleModal, setSelectedStyleModal] = useState<TattooStyleCatalogItem | null>(null);

  // Style Finder / Interactive 3-Step Quiz State
  const [quizVibe, setQuizVibe] = useState<string>("spiritual");
  const [quizPlacement, setQuizPlacement] = useState<string>("forearm");
  const [quizColor, setQuizColor] = useState<string>("black-grey");

  // Filtered Styles
  const filteredStyles = useMemo(() => {
    return TATTOO_STYLES_CATALOG.filter((item) => {
      const matchesCat =
        selectedCategory === "All Styles" || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.tagline.toLowerCase().includes(q) ||
        item.short_desc.toLowerCase().includes(q) ||
        item.popular_placements.toLowerCase().includes(q) ||
        item.key_elements.some((k) => k.toLowerCase().includes(q));
      return matchesCat && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Quiz Recommendation Logic based on vibe, placement & color
  const recommendedStyle = useMemo(() => {
    if (quizVibe === "spiritual") return TATTOO_STYLES_CATALOG.find((s) => s.id === "spiritual");
    if (quizVibe === "fine-line") return TATTOO_STYLES_CATALOG.find((s) => s.id === "fine-line");
    if (quizVibe === "realism") return TATTOO_STYLES_CATALOG.find((s) => s.id === "realism");
    if (quizVibe === "micro") return TATTOO_STYLES_CATALOG.find((s) => s.id === "micro-realism");
    if (quizVibe === "mandala") return TATTOO_STYLES_CATALOG.find((s) => s.id === "mandala-dotwork");
    if (quizVibe === "japanese") return TATTOO_STYLES_CATALOG.find((s) => s.id === "japanese-irezumi");
    if (quizVibe === "anime") return TATTOO_STYLES_CATALOG.find((s) => s.id === "anime-manga");
    if (quizVibe === "watercolor") return TATTOO_STYLES_CATALOG.find((s) => s.id === "watercolor");
    if (quizVibe === "minimalist") return TATTOO_STYLES_CATALOG.find((s) => s.id === "minimalist");
    if (quizVibe === "script") return TATTOO_STYLES_CATALOG.find((s) => s.id === "script-calligraphy");
    if (quizVibe === "coverup") return TATTOO_STYLES_CATALOG.find((s) => s.id === "cover-up");
    return TATTOO_STYLES_CATALOG[0];
  }, [quizVibe]);

  const getWhatsAppUrl = (styleName: string) => {
    const text = `Hi Jainik, I am interested in booking a consultation for a *${styleName}* tattoo piece at Tattoo Iconic.`;
    return `https://wa.me/${ARTIST_PROFILE.whatsapp_number.replace(/\+/g, "")}?text=${encodeURIComponent(text)}`;
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#0A0B0E] text-[#F5F0EB] pt-28 sm:pt-32 pb-24 selection:bg-amber-500/30">
        {/* ── AMBIENT ATMOSPHERIC GLOWS ── */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-500/5 rounded-full blur-[140px]" />
          <div className="absolute top-2/3 -left-48 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[160px]" />
        </div>

        <div className="container-hero relative z-10 space-y-16 sm:space-y-24">
          {/* ── HEADER / HERO ── */}
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-semibold tracking-widest uppercase">
              <Sparkles size={14} className="animate-pulse" />
              Master Style Atelier · 13 Distinct Genres
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]">
              Tattoo Styles &amp;{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F3E5AB] via-[#D4AF37] to-[#AA7A1E]">
                Artistic Mastery
              </span>
            </h1>

            <p className="text-ink-300 text-base sm:text-lg sm:leading-relaxed max-w-2xl mx-auto">
              From sacred Vedic devotional iconography and single-needle botanical fine line to hyper-detailed dark realism and full-sleeve Japanese Irezumi — explore every technique mastered by Jainik Patel.
            </p>

            {/* Quick Stats Bar */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-4 text-center">
                <span className="font-serif text-2xl sm:text-3xl font-bold text-amber-300">13</span>
                <p className="text-xs text-ink-400 mt-1 uppercase tracking-wider">Master Styles</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-4 text-center">
                <span className="font-serif text-2xl sm:text-3xl font-bold text-amber-300">0.25mm</span>
                <p className="text-xs text-ink-400 mt-1 uppercase tracking-wider">Single Needle Precision</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-4 text-center">
                <span className="font-serif text-2xl sm:text-3xl font-bold text-amber-300">7,000+</span>
                <p className="text-xs text-ink-400 mt-1 uppercase tracking-wider">Healed Masterpieces</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-4 text-center">
                <span className="font-serif text-2xl sm:text-3xl font-bold text-amber-300">100%</span>
                <p className="text-xs text-ink-400 mt-1 uppercase tracking-wider">Custom Drafted</p>
              </div>
            </div>
          </div>

          {/* ── FILTER & SEARCH BAR ── */}
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-3 rounded-2xl border border-white/10 bg-[#121319]/80 backdrop-blur-xl">
              {/* Category Pills */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 w-full md:w-auto">
                {CATEGORIES.map((cat) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-all cursor-pointer ${
                        isActive
                          ? "bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-lg shadow-amber-500/20 font-bold"
                          : "text-ink-300 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:w-72 shrink-0">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search styles, placements, motifs..."
                  className="w-full rounded-xl border border-white/10 bg-black/40 pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder:text-ink-500 focus:border-amber-500/60 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink-400 hover:text-white"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-ink-400 px-2">
              <span>
                Showing <strong className="text-amber-300">{filteredStyles.length}</strong> styles
              </span>
              <span>Click on any style card for needle specs &amp; placement guide</span>
            </div>
          </div>

          {/* ── MASTER STYLES GRID ── */}
          {filteredStyles.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/[0.02] py-16 text-center space-y-4">
              <SlidersHorizontal size={36} className="mx-auto text-amber-400/60" />
              <h3 className="font-serif text-xl text-white">No styles matched your search</h3>
              <p className="text-sm text-ink-400 max-w-md mx-auto">
                Try searching for keywords like &ldquo;spiritual&rdquo;, &ldquo;fine line&rdquo;, &ldquo;dragon&rdquo;, &ldquo;forearm&rdquo;, or &ldquo;mandala&rdquo;.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("All Styles");
                  setSearchQuery("");
                }}
                className="btn-secondary text-xs px-5 py-2"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredStyles.map((style) => (
                <LusionSpotlightCard
                  key={style.id}
                  tiltStrength={6}
                  spotlightColor="rgba(212, 175, 55, 0.15)"
                  className="group relative flex flex-col rounded-3xl border border-white/10 bg-[#121319]/90 backdrop-blur-xl overflow-hidden shadow-2xl transition-all duration-300 hover:border-amber-500/40"
                >
                  {/* Image Preview */}
                  <div
                    onClick={() => setSelectedStyleModal(style)}
                    className="relative aspect-[4/3] w-full overflow-hidden bg-ink-950 cursor-pointer"
                  >
                    <Image
                      src={style.image}
                      alt={`${style.name} Tattoo Style — Tattoo Iconic`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121319] via-transparent to-black/30" />

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="rounded-full bg-black/70 backdrop-blur-md px-3 py-1 text-[11px] font-semibold tracking-wider uppercase text-amber-300 border border-amber-500/30">
                        {style.category}
                      </span>
                    </div>

                    {/* Color Type Badge */}
                    <div className="absolute top-4 right-4">
                      <span className="rounded-full bg-black/70 backdrop-blur-md px-2.5 py-1 text-[10px] font-medium text-white/80 border border-white/10">
                        {style.color_type}
                      </span>
                    </div>

                    {/* Pain Level Indicator */}
                    <div className="absolute bottom-3 left-4 flex items-center gap-1.5 text-xs text-amber-200/90 font-medium">
                      <Activity size={13} className="text-amber-400" />
                      <span>Pain: {style.pain_level}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-6">
                    <div className="space-y-3">
                      <div>
                        <h2
                          onClick={() => setSelectedStyleModal(style)}
                          className="font-serif text-xl sm:text-2xl font-bold text-white group-hover:text-amber-200 transition-colors cursor-pointer"
                        >
                          {style.name}
                        </h2>
                        <p className="text-xs font-semibold tracking-wide text-amber-400/90 uppercase mt-0.5">
                          {style.tagline}
                        </p>
                      </div>

                      <p className="text-ink-300 text-xs sm:text-sm leading-relaxed line-clamp-3">
                        {style.short_desc}
                      </p>

                      {/* Key Elements Tags */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {style.key_elements.slice(0, 3).map((el) => (
                          <span
                            key={el}
                            className="rounded-lg bg-white/[0.04] border border-white/10 px-2.5 py-1 text-[11px] text-ink-300"
                          >
                            {el}
                          </span>
                        ))}
                        {style.key_elements.length > 3 && (
                          <span className="rounded-lg bg-amber-500/10 border border-amber-500/20 px-2 py-1 text-[10px] font-semibold text-amber-300">
                            +{style.key_elements.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Bottom Specs & Quick Actions */}
                    <div className="pt-4 border-t border-white/10 space-y-4">
                      <div className="grid grid-cols-2 gap-2 text-xs text-ink-400">
                        <div>
                          <span className="block text-[10px] uppercase tracking-wider text-ink-500 font-semibold">
                            Placements
                          </span>
                          <span className="text-ink-300 truncate block">
                            {style.popular_placements.split(",")[0]}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[10px] uppercase tracking-wider text-ink-500 font-semibold">
                            Healing Time
                          </span>
                          <span className="text-ink-300">{style.healing_time}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setSelectedStyleModal(style)}
                          className="flex-1 py-2.5 px-3 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-semibold text-white transition-all text-center flex items-center justify-center gap-1.5 group-hover:border-amber-500/50 cursor-pointer"
                        >
                          <span>Full Specs</span>
                          <ChevronRight size={14} />
                        </button>

                        <Link
                          href={`/booking?style=${encodeURIComponent(style.booking_style)}`}
                          className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black text-xs font-bold transition-all text-center flex items-center gap-1 shadow-md shadow-amber-500/10 shrink-0"
                        >
                          <span>Book</span>
                          <ArrowRight size={13} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </LusionSpotlightCard>
              ))}
            </div>
          )}

          {/* ── STYLE FINDER & QUIZ WIDGET ── */}
          <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-[#151720] via-[#101117] to-[#0A0B0E] p-8 sm:p-12 relative overflow-hidden shadow-2xl">
            <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

            <div className="grid lg:grid-cols-12 gap-10 items-center relative z-10">
              {/* Left Column: Quiz Description */}
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
                  <Compass size={13} />
                  Style Match Finder
                </div>

                <h2 className="font-serif text-3xl sm:text-4xl text-white font-bold leading-tight">
                  Not Sure Which Style Fits Your Idea?
                </h2>

                <p className="text-ink-300 text-sm sm:text-base leading-relaxed">
                  Every tattoo is an anatomical dialogue. Select your preferred concept vibe below and our master algorithm will recommend the ideal genre and execution technique.
                </p>

                {/* Question 1: Concept / Vibe */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-ink-300 uppercase tracking-wider block">
                    1. What is your concept vibe?
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { id: "spiritual", label: "Devotional / Sacred" },
                      { id: "fine-line", label: "Delicate Botanicals" },
                      { id: "realism", label: "Portrait / Wildlife" },
                      { id: "micro", label: "Miniature Fine Art" },
                      { id: "mandala", label: "Sacred Mandala" },
                      { id: "japanese", label: "Dragon / Oriental" },
                      { id: "anime", label: "Anime / Manga" },
                      { id: "watercolor", label: "Color Splash" },
                      { id: "minimalist", label: "Subtle Symbol / Maa" },
                      { id: "script", label: "Sanskrit Shloka" },
                      { id: "coverup", label: "Cover-up Old Ink" },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setQuizVibe(opt.id)}
                        className={`p-2.5 rounded-xl border text-xs font-medium transition-all text-left truncate cursor-pointer ${
                          quizVibe === opt.id
                            ? "border-amber-400 bg-amber-500/20 text-amber-200 font-bold"
                            : "border-white/10 bg-white/[0.03] text-ink-300 hover:bg-white/[0.07]"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Question 2: Desired Placement */}
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-bold text-ink-300 uppercase tracking-wider block">
                    2. Desired Placement?
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {[
                      { id: "forearm", label: "Forearm" },
                      { id: "sleeve", label: "Full Sleeve" },
                      { id: "ribs", label: "Ribs / Spine" },
                      { id: "chest", label: "Chest / Back" },
                      { id: "wrist", label: "Wrist / Ankle" },
                    ].map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setQuizPlacement(p.id)}
                        className={`p-2 rounded-xl border text-xs font-medium transition-all text-center truncate cursor-pointer ${
                          quizPlacement === p.id
                            ? "border-amber-400 bg-amber-500/20 text-amber-200 font-bold"
                            : "border-white/10 bg-white/[0.03] text-ink-300 hover:bg-white/[0.07]"
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Question 3: Color Palette */}
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-bold text-ink-300 uppercase tracking-wider block">
                    3. Color Palette Preference?
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "black-grey", label: "Black & Grey" },
                      { id: "single-needle", label: "Single Needle" },
                      { id: "color", label: "Vibrant Color" },
                    ].map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setQuizColor(c.id)}
                        className={`p-2 rounded-xl border text-xs font-medium transition-all text-center truncate cursor-pointer ${
                          quizColor === c.id
                            ? "border-amber-400 bg-amber-500/20 text-amber-200 font-bold"
                            : "border-white/10 bg-white/[0.03] text-ink-300 hover:bg-white/[0.07]"
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Dynamic Recommendation Preview */}
              {recommendedStyle && (
                <div className="lg:col-span-6">
                  <div className="rounded-2xl border border-amber-500/40 bg-black/60 backdrop-blur-xl p-6 sm:p-8 space-y-6 shadow-2xl">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                        Recommended Match
                      </span>
                      <span className="rounded-full bg-amber-500/20 border border-amber-500/40 px-3 py-0.5 text-xs text-amber-300 font-medium">
                        99% Synergy
                      </span>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-2xl overflow-hidden shrink-0 border border-white/20">
                        <Image
                          src={recommendedStyle.image}
                          alt={recommendedStyle.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                          {recommendedStyle.name}
                        </h3>
                        <p className="text-xs text-amber-300/90 font-medium">
                          {recommendedStyle.tagline}
                        </p>
                        <p className="text-xs text-ink-300 line-clamp-2 pt-1">
                          {recommendedStyle.short_desc}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs border-y border-white/10 py-3">
                      <div>
                        <span className="text-ink-500 block text-[10px] uppercase">Best Placements</span>
                        <span className="text-white font-medium">{recommendedStyle.popular_placements}</span>
                      </div>
                      <div>
                        <span className="text-ink-500 block text-[10px] uppercase">Needle Cartridge</span>
                        <span className="text-white font-medium">{recommendedStyle.needle_specs}</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link
                        href={`/booking?style=${encodeURIComponent(recommendedStyle.booking_style)}`}
                        className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20"
                      >
                        <span>Book Consultation for This Style</span>
                        <ArrowRight size={14} />
                      </Link>

                      <a
                        href={getWhatsAppUrl(recommendedStyle.name)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-3 px-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs font-semibold text-center flex items-center justify-center gap-1.5"
                      >
                        <MessageCircle size={14} />
                        <span>Ask on WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── PLACEMENT & ANATOMY MATRIX ── */}
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
                Anatomical Placement &amp; Style Pairing
              </h2>
              <p className="text-xs sm:text-sm text-ink-400">
                Certain styles harmonise naturally with particular muscle contours and skin textures.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  zone: "Forearm & Inner Bicep",
                  styles: "Spiritual, Dark Realism, Fine Line, Anime, Calligraphy",
                  desc: "Low to moderate pain, high visibility, and smooth flat canvas ideal for portraiture, shlokas, and fine single-needle work.",
                  pain: "Low to Medium",
                },
                {
                  zone: "Full Arm & Leg Sleeve",
                  styles: "Japanese Irezumi, Dark Realism, Bespoke Storytelling",
                  desc: "Unbroken muscular flow ideal for dynamic wrapping elements like dragons, wind bars, continuous wildlife scenes, and large epics.",
                  pain: "Medium",
                },
                {
                  zone: "Collarbone, Ribs & Spine",
                  styles: "Fine Line, Minimalist, Sanskrit Calligraphy, Sacred Geometry",
                  desc: "Delicate aesthetic zones requiring whisper-thin linework that flows gracefully with bone structure.",
                  pain: "Medium to High",
                },
                {
                  zone: "Chest & Center Torso",
                  styles: "Spiritual Trishul, Sacred Mandala Dotwork, Traditional",
                  desc: "Symmetrical power zone for centered devotional emblems, expansive wings, and cosmic yantras.",
                  pain: "Medium to High",
                },
                {
                  zone: "Wrist, Ankle & Micro Zones",
                  styles: "Minimalist, Micro-Realism, Small Calligraphy",
                  desc: "Discreet and intimate zones for micro-tattoos, meaningful dates, initial letters, or tiny photorealistic eyes.",
                  pain: "Low to Medium",
                },
                {
                  zone: "Full Back Canvas",
                  styles: "Japanese Irezumi, Lord Hanuman Realism, Custom Camouflage",
                  desc: "The premier canvas for full-scale artistic masterworks, complete mythological battles, and dramatic cover-ups.",
                  pain: "Medium to High",
                },
              ].map((item) => (
                <div
                  key={item.zone}
                  className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-3 hover:border-amber-500/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-lg font-bold text-white">{item.zone}</h3>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-white/5 text-amber-300 border border-white/10">
                      Pain: {item.pain}
                    </span>
                  </div>
                  <p className="text-xs text-amber-400/90 font-medium">
                    Recommended: {item.styles}
                  </p>
                  <p className="text-xs text-ink-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── STUDIO & LUXURY HOME SERVICE PROMISE ── */}
          <div className="rounded-3xl border border-white/15 bg-[#121319] p-8 sm:p-12 grid md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-300 border border-amber-500/30">
                <ShieldCheck size={24} />
              </div>
              <h3 className="font-serif text-lg font-bold text-white">Hospital-Grade Sterilization</h3>
              <p className="text-xs text-ink-400 leading-relaxed">
                Single-use sealed needle cartridges, medical autoclave protocols, and REACH-certified vegan organic inks for flawless healed results.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-300 border border-amber-500/30">
                <Layers size={24} />
              </div>
              <h3 className="font-serif text-lg font-bold text-white">1-on-1 Anatomical Drafting</h3>
              <p className="text-xs text-ink-400 leading-relaxed">
                Zero generic copies. Every piece is drafted directly to your muscle contours, ensuring proportion, flow, and lifelong pride.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-300 border border-amber-500/30">
                <Zap size={24} />
              </div>
              <h3 className="font-serif text-lg font-bold text-white">Studio &amp; Luxury Home Visit</h3>
              <p className="text-xs text-ink-400 leading-relaxed">
                Visit our tranquil Bhadam studio or book Jainik&apos;s VIP mobile doorstep tattoo service in Rajpipla, Vadodara, Surat &amp; Bharuch.
              </p>
            </div>
          </div>

          {/* ── BOTTOM CTA ── */}
          <div className="text-center space-y-6 pt-8">
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white">
              Ready to Craft Your Masterpiece?
            </h2>
            <p className="text-sm sm:text-base text-ink-300 max-w-xl mx-auto">
              Schedule your 1-on-1 private consultation with Jainik Patel or message directly on WhatsApp with your idea references.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/booking"
                className="btn-primary px-8 py-3.5 text-sm font-bold shadow-xl shadow-amber-500/20"
              >
                <span>Book Consultation</span>
                <ArrowRight size={16} />
              </Link>
              <a
                href={getWhatsAppUrl("Custom")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary px-8 py-3.5 text-sm font-semibold flex items-center gap-2"
              >
                <MessageCircle size={16} className="text-emerald-400" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* ── FULL STYLE DETAILS MODAL ── */}
      <AnimatePresence>
        {selectedStyleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStyleModal(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 w-full max-w-3xl rounded-3xl border border-white/20 bg-[#121319] p-6 sm:p-8 text-white shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedStyleModal(null)}
                className="absolute top-5 right-5 h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-ink-300 hover:text-white transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>

              <div className="grid sm:grid-cols-12 gap-6 items-start">
                {/* Visual */}
                <div className="sm:col-span-5 relative aspect-square rounded-2xl overflow-hidden border border-white/10 bg-ink-950">
                  <Image
                    src={selectedStyleModal.image}
                    alt={selectedStyleModal.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="rounded-full bg-black/80 backdrop-blur-md px-3 py-1 text-[11px] font-semibold text-amber-300 border border-amber-500/30">
                      {selectedStyleModal.category}
                    </span>
                  </div>
                </div>

                {/* Main Details */}
                <div className="sm:col-span-7 space-y-3">
                  <div>
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                      {selectedStyleModal.name}
                    </h3>
                    <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider mt-0.5">
                      {selectedStyleModal.tagline}
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm text-ink-300 leading-relaxed">
                    {selectedStyleModal.full_desc}
                  </p>

                  <div className="pt-2">
                    <span className="text-[11px] uppercase tracking-wider text-ink-400 font-bold block mb-1.5">
                      Key Design Motifs &amp; Elements
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedStyleModal.key_elements.map((el) => (
                        <span
                          key={el}
                          className="rounded-lg bg-white/5 border border-white/10 px-2.5 py-1 text-xs text-ink-200"
                        >
                          {el}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Technical Specifications Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl border border-white/10 bg-white/[0.02] text-xs">
                <div>
                  <span className="text-ink-500 block text-[10px] uppercase font-semibold">
                    Needle Setup
                  </span>
                  <span className="text-white font-medium">{selectedStyleModal.needle_specs}</span>
                </div>
                <div>
                  <span className="text-ink-500 block text-[10px] uppercase font-semibold">
                    Pain Index
                  </span>
                  <span className="text-amber-300 font-medium">{selectedStyleModal.pain_level}</span>
                </div>
                <div>
                  <span className="text-ink-500 block text-[10px] uppercase font-semibold">
                    Healing Time
                  </span>
                  <span className="text-white font-medium">{selectedStyleModal.healing_time}</span>
                </div>
                <div>
                  <span className="text-ink-500 block text-[10px] uppercase font-semibold">
                    Color Profile
                  </span>
                  <span className="text-white font-medium">{selectedStyleModal.color_type}</span>
                </div>
              </div>

              {/* Ideal Placements */}
              <div className="rounded-xl border border-white/10 bg-black/40 p-3.5 text-xs space-y-1">
                <span className="text-ink-400 font-semibold block">Recommended Body Placements:</span>
                <p className="text-ink-200">{selectedStyleModal.popular_placements}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <Link
                  href={`/booking?style=${encodeURIComponent(selectedStyleModal.booking_style)}`}
                  onClick={() => setSelectedStyleModal(null)}
                  className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black text-xs sm:text-sm font-bold text-center flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20"
                >
                  <span>Book Consultation for This Style</span>
                  <ArrowRight size={15} />
                </Link>

                <Link
                  href={`/portfolio?style=${encodeURIComponent(selectedStyleModal.portfolio_style)}`}
                  onClick={() => setSelectedStyleModal(null)}
                  className="w-full sm:w-auto py-3 px-5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white text-xs sm:text-sm font-semibold text-center"
                >
                  View in Portfolio
                </Link>

                <a
                  href={getWhatsAppUrl(selectedStyleModal.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto py-3 px-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs font-semibold text-center flex items-center justify-center gap-1.5"
                >
                  <MessageCircle size={15} />
                  <span>WhatsApp</span>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}
