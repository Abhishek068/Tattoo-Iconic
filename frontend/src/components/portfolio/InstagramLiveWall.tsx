"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Instagram,
  Heart,
  MessageCircle,
  ExternalLink,
  Sparkles,
  RefreshCw,
  Search,
  Filter,
  X,
  Share2,
  Calendar,
  Check,
  Flame,
  Award,
  ShieldCheck,
  MapPin,
  Maximize2,
} from "lucide-react";
import { instagramService } from "@/services/instagramService";
import type { InstagramPostItem } from "@/types";
import { ARTIST_PROFILE } from "@/constants";
import toast from "react-hot-toast";

const STYLES = [
  "All",
  "Spiritual",
  "Realism",
  "Fine Line",
  "Geometric",
  "Script",
  "Blackwork",
];

const PLACEMENTS = [
  "All",
  "Forearm",
  "Bicep",
  "Full Sleeve",
  "Shoulder",
  "Wrist",
  "Chest",
  "Spine",
];

export function InstagramLiveWall() {
  const [posts, setPosts] = useState<InstagramPostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState("All");
  const [selectedPlacement, setSelectedPlacement] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeModalPost, setActiveModalPost] = useState<InstagramPostItem | null>(null);
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);

  useEffect(() => {
    instagramService.getFeed().then((data) => {
      setPosts(data);
      setLoading(false);
    });
  }, []);

  const handleSync = async () => {
    setIsSyncing(true);
    toast.loading("Syncing with @tatoo.iconic Instagram feed...", { id: "ig-sync" });
    const res = await instagramService.triggerSync();
    setIsSyncing(false);
    if (res.success) {
      toast.success(res.message || "Instagram feed refreshed!", { id: "ig-sync" });
      const updated = await instagramService.getFeed();
      setPosts(updated);
    } else {
      toast.error("Failed to sync Instagram feed", { id: "ig-sync" });
    }
  };

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesStyle =
        selectedStyle === "All" ||
        post.style_tag?.toLowerCase() === selectedStyle.toLowerCase() ||
        post.style_tags?.some((t) => t.toLowerCase() === selectedStyle.toLowerCase());

      const matchesPlacement =
        selectedPlacement === "All" ||
        post.placement?.toLowerCase().includes(selectedPlacement.toLowerCase());

      const matchesSearch =
        !searchQuery.trim() ||
        post.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.style_tag?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.placement?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesStyle && matchesPlacement && matchesSearch;
    });
  }, [posts, selectedStyle, selectedPlacement, searchQuery]);

  const handleCopyLink = (post: InstagramPostItem) => {
    navigator.clipboard.writeText(post.permalink);
    setCopiedPostId(post.id);
    toast.success("Instagram link copied to clipboard!");
    setTimeout(() => setCopiedPostId(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Instagram Master Artist Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-fuchsia-500/25 bg-gradient-to-r from-fuchsia-950/50 via-ink-900/90 to-ink-950 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 h-64 w-64 rounded-full bg-fuchsia-500/10 blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            {/* Profile Avatar with Instagram Gradient Ring */}
            <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-fuchsia-600 p-1 shrink-0 shadow-xl shadow-fuchsia-950/50">
              <div className="h-full w-full rounded-2xl overflow-hidden bg-ink-950 relative">
                <Image
                  src={ARTIST_PROFILE.profile_image}
                  alt="Tattoo Iconic Instagram"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="absolute -bottom-1 -right-1 rounded-full bg-gradient-to-tr from-rose-500 to-fuchsia-600 p-1.5 text-white border-2 border-ink-950 shadow-md">
                <Instagram size={14} />
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-fuchsia-500/20 border border-fuchsia-500/30 px-3 py-0.5 text-[11px] font-bold text-fuchsia-300">
                  <Sparkles size={12} />
                  <span>Automated Public Instagram Feed</span>
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Live Connected</span>
                </span>
              </div>

              <h2 className="font-display text-2xl sm:text-3xl text-white font-bold mt-1.5">
                @{ARTIST_PROFILE.instagram_handle}
              </h2>
              <p className="text-xs sm:text-sm text-ink-300 mt-1 max-w-xl">
                Master Tattoo Artist <strong>Jainik Patel</strong> · 10+ Years Experience · 7,000+ Inked Collectors · Bhadam, Rajpipla & Luxury Home Service across Gujarat.
              </p>

              {/* Quick Stats Badges */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-3 text-xs text-ink-300">
                <div className="flex items-center gap-1.5 text-amber-300 font-semibold">
                  <Flame size={14} className="text-amber-400" />
                  <span>2,461+ Instagram Posts</span>
                </div>
                <div className="flex items-center gap-1.5 text-ink-200 font-semibold">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  <span>Hospital-Grade Hygiene</span>
                </div>
                <div className="flex items-center gap-1.5 text-ink-200 font-semibold">
                  <MapPin size={14} className="text-rose-400" />
                  <span>Studio &amp; Home Visits</span>
                </div>
              </div>
            </div>
          </div>

          {/* Top Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <button
              onClick={handleSync}
              disabled={isSyncing}
              className="rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-ink-200 hover:text-white px-4 py-2.5 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-lg active:scale-95"
            >
              <RefreshCw size={14} className={isSyncing ? "animate-spin text-amber-400" : ""} />
              <span>{isSyncing ? "Syncing Feed..." : "Sync Live Feed"}</span>
            </button>

            <a
              href={`https://www.instagram.com/${ARTIST_PROFILE.instagram_handle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-gradient-to-r from-rose-500 via-fuchsia-600 to-amber-500 hover:opacity-95 text-white font-bold text-xs py-2.5 px-5 flex items-center gap-2 shadow-lg shadow-fuchsia-500/25 transition-all active:scale-95"
            >
              <Instagram size={16} />
              <span>Open on Instagram</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="space-y-4 rounded-2xl border border-white/10 bg-ink-900/60 p-4 backdrop-blur-md">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tattoos by style, god name, body placement, or keyword (e.g., Shiva, Hanuman, Lion, Forearm)..."
              className="w-full rounded-xl border border-white/10 bg-ink-950/80 py-2.5 pl-10 pr-10 text-xs text-white placeholder-ink-400 focus:border-fuchsia-500 focus:outline-none focus:ring-1 focus:ring-fuchsia-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="text-xs text-ink-300 shrink-0 flex items-center gap-2">
            <span>Showing</span>
            <strong className="text-white font-mono">{filteredPosts.length}</strong>
            <span>of</span>
            <strong className="text-white font-mono">{posts.length}</strong>
            <span>synced tattoos</span>
          </div>
        </div>

        {/* Style Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-[11px] font-bold text-ink-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <Filter size={12} /> Style:
          </span>
          {STYLES.map((style) => (
            <button
              key={style}
              onClick={() => setSelectedStyle(style)}
              className={`rounded-lg px-3 py-1.5 font-medium transition-all shrink-0 cursor-pointer ${
                selectedStyle === style
                  ? "bg-fuchsia-600 text-white shadow-md shadow-fuchsia-600/30"
                  : "bg-white/5 text-ink-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              {style}
            </button>
          ))}
        </div>

        {/* Placement Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs border-t border-white/5 pt-3">
          <span className="text-[11px] font-bold text-ink-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            Placement:
          </span>
          {PLACEMENTS.map((place) => (
            <button
              key={place}
              onClick={() => setSelectedPlacement(place)}
              className={`rounded-lg px-3 py-1 font-medium transition-all shrink-0 cursor-pointer ${
                selectedPlacement === place
                  ? "bg-amber-500 text-ink-950 font-bold shadow-md shadow-amber-500/30"
                  : "bg-white/5 text-ink-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              {place}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Instagram Posts */}
      {filteredPosts.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-ink-900/40 p-12 text-center">
          <Instagram size={40} className="mx-auto text-fuchsia-400 mb-3 opacity-60" />
          <h3 className="text-lg font-bold text-white">No matching tattoo posts found</h3>
          <p className="text-xs text-ink-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search terms or filter selections to view all synced Instagram posts.
          </p>
          <button
            onClick={() => {
              setSelectedStyle("All");
              setSelectedPlacement("All");
              setSearchQuery("");
            }}
            className="mt-4 rounded-xl bg-white/10 hover:bg-white/15 px-4 py-2 text-xs font-semibold text-white transition-all"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.4) }}
              className="group rounded-2xl border border-white/10 bg-ink-900 overflow-hidden shadow-xl hover:border-fuchsia-500/40 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Media Thumbnail */}
                <div
                  onClick={() => setActiveModalPost(post)}
                  className="relative aspect-square w-full overflow-hidden bg-ink-950 cursor-pointer"
                >
                  <Image
                    src={post.media_url}
                    alt={post.caption}
                    fill
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />

                  {/* Top Instagram Pill */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
                    <span className="rounded-full bg-ink-950/80 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-white border border-white/10 flex items-center gap-1">
                      <Instagram size={11} className="text-fuchsia-400" />
                      <span>@{ARTIST_PROFILE.instagram_handle}</span>
                    </span>

                    {post.style_tag && (
                      <span className="rounded-full bg-amber-500/25 border border-amber-500/40 px-2 py-0.5 text-[9px] font-bold text-amber-200 backdrop-blur-md">
                        {post.style_tag}
                      </span>
                    )}
                  </div>

                  {/* Zoom Overlay on Hover */}
                  <div className="absolute inset-0 bg-ink-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <span className="rounded-full bg-ink-950/80 border border-white/20 p-3 text-white shadow-xl backdrop-blur-md transform scale-90 group-hover:scale-100 transition-transform">
                      <Maximize2 size={18} />
                    </span>
                  </div>

                  {/* Bottom Engagement Bar on Hover */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950 via-ink-950/80 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-between text-xs text-white">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 font-bold text-rose-300">
                        <Heart size={14} className="fill-rose-400 text-rose-400" />
                        {post.like_count || "4.8k"}
                      </span>
                      <span className="flex items-center gap-1 text-ink-200">
                        <MessageCircle size={14} />
                        {post.comments_count || "160"}
                      </span>
                    </div>

                    <span className="text-[11px] font-semibold text-fuchsia-300">
                      Tap to Inspect &rarr;
                    </span>
                  </div>
                </div>

                {/* Caption & Placement */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-[10px] text-ink-400">
                    <span>
                      Placement: <strong className="text-ink-200 font-semibold">{post.placement || "Custom"}</strong>
                    </span>
                    <span>
                      {new Date(post.timestamp).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                  <p className="text-xs text-ink-200 line-clamp-3 leading-relaxed">
                    {post.caption}
                  </p>
                </div>
              </div>

              {/* Quick Action Footer */}
              <div className="p-3 bg-ink-950/70 border-t border-white/5 flex items-center justify-between gap-2 text-xs">
                <a
                  href={post.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-ink-400 hover:text-fuchsia-300 flex items-center gap-1 transition-colors py-1"
                >
                  <ExternalLink size={12} />
                  <span>IG Post</span>
                </a>

                <a
                  href={`https://wa.me/${ARTIST_PROFILE.whatsapp_number.replace(
                    /[^0-9]/g,
                    ""
                  )}?text=${encodeURIComponent(
                    `Hello Jainik bhai, I saw this tattoo on your website portfolio (@tatoo.iconic): ${post.caption.slice(
                      0,
                      80
                    )}... Link: ${post.permalink} - I would like to book a consultation for a similar piece!`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 px-3 py-1.5 text-[11px] font-bold flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <MessageCircle size={13} />
                  <span>Book on WhatsApp</span>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Lightbox / Post Detail Modal */}
      <AnimatePresence>
        {activeModalPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-ink-950/85 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl border border-fuchsia-500/30 bg-ink-900 shadow-2xl flex flex-col md:flex-row"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveModalPost(null)}
                className="absolute top-4 right-4 z-20 rounded-full bg-ink-950/80 p-2 text-ink-300 hover:text-white hover:bg-ink-950 border border-white/15 transition-all cursor-pointer"
              >
                <X size={18} />
              </button>

              {/* Left Column: Media Image */}
              <div className="relative w-full md:w-1/2 aspect-square md:aspect-auto min-h-[300px] md:min-h-[500px] bg-ink-950">
                <Image
                  src={activeModalPost.media_url}
                  alt={activeModalPost.caption}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              {/* Right Column: Metadata & Booking */}
              <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto bg-gradient-to-b from-ink-900 to-ink-950 space-y-6">
                <div className="space-y-4">
                  {/* Header info */}
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-fuchsia-600 p-0.5 shrink-0">
                      <div className="h-full w-full rounded-full overflow-hidden relative">
                        <Image
                          src={ARTIST_PROFILE.profile_image}
                          alt="Jainik Patel"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                        <span>@{ARTIST_PROFILE.instagram_handle}</span>
                        <span className="rounded-full bg-fuchsia-500/20 text-fuchsia-300 text-[10px] px-2 py-0.5 font-semibold">
                          Official Post
                        </span>
                      </h4>
                      <p className="text-[11px] text-ink-400">
                        Jainik Patel · Bhadam, Rajpipla
                      </p>
                    </div>
                  </div>

                  {/* Tags & Placement */}
                  <div className="flex flex-wrap gap-1.5">
                    {activeModalPost.style_tag && (
                      <span className="rounded-md bg-fuchsia-500/20 border border-fuchsia-500/30 px-2.5 py-1 text-xs font-bold text-fuchsia-300">
                        {activeModalPost.style_tag}
                      </span>
                    )}
                    {activeModalPost.placement && (
                      <span className="rounded-md bg-amber-500/20 border border-amber-500/30 px-2.5 py-1 text-xs font-bold text-amber-300">
                        {activeModalPost.placement}
                      </span>
                    )}
                  </div>

                  {/* Caption */}
                  <div className="rounded-2xl bg-ink-950/60 border border-white/5 p-4 text-xs text-ink-200 leading-relaxed max-h-48 overflow-y-auto">
                    <p className="whitespace-pre-line">{activeModalPost.caption}</p>
                  </div>

                  {/* Engagement Metrics */}
                  <div className="flex items-center gap-6 text-xs text-ink-300 border-t border-b border-white/5 py-3">
                    <span className="flex items-center gap-1.5 font-bold text-rose-300">
                      <Heart size={16} className="fill-rose-400 text-rose-400" />
                      {activeModalPost.like_count || "4.8k"} likes
                    </span>
                    <span className="flex items-center gap-1.5 text-ink-300">
                      <MessageCircle size={16} />
                      {activeModalPost.comments_count || "160"} comments
                    </span>
                    <span className="text-ink-400 text-[11px] ml-auto">
                      {new Date(activeModalPost.timestamp).toLocaleDateString("en-IN", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="space-y-2.5 pt-2">
                  <a
                    href={`https://wa.me/${ARTIST_PROFILE.whatsapp_number.replace(
                      /[^0-9]/g,
                      ""
                    )}?text=${encodeURIComponent(
                      `Hello Jainik bhai, I am interested in getting a custom tattoo similar to this piece from your portfolio (@tatoo.iconic): ${activeModalPost.caption.slice(
                        0,
                        90
                      )}...\nLink: ${activeModalPost.permalink}\n\nPlease let me know your available session dates and pricing estimates.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-bold text-xs py-3 px-4 flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 transition-all active:scale-98"
                  >
                    <MessageCircle size={16} />
                    <span>Inquire / Book this Tattoo on WhatsApp (+91 8238767100)</span>
                  </a>

                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={activeModalPost.permalink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-ink-200 hover:text-white py-2.5 px-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Instagram size={14} className="text-fuchsia-400" />
                      <span>View on Instagram</span>
                    </a>

                    <button
                      onClick={() => handleCopyLink(activeModalPost)}
                      className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-ink-200 hover:text-white py-2.5 px-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      {copiedPostId === activeModalPost.id ? (
                        <>
                          <Check size={14} className="text-emerald-400" />
                          <span className="text-emerald-400">Link Copied!</span>
                        </>
                      ) : (
                        <>
                          <Share2 size={14} />
                          <span>Share Post Link</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

