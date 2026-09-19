"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Link as LinkIcon,
  Instagram,
  Upload,
  Sparkles,
  X,
  CheckCircle2,
  RefreshCw,
  Plus,
  Layers,
  ArrowRight,
} from "lucide-react";
import { portfolioService } from "@/services/portfolioService";
import { inspirationService } from "@/services/inspirationService";
import { instagramService } from "@/services/instagramService";
import toast from "react-hot-toast";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: () => void;
}

export function QuickImporterModal({ isOpen, onClose, onImportSuccess }: Props) {
  const [activeTab, setActiveTab] = useState<"link" | "instagram" | "batch">("link");

  // Link Importer State
  const [sourceUrl, setSourceUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [primaryStyle, setPrimaryStyle] = useState("Fine Line");
  const [placement, setPlacement] = useState("Forearm");
  const [category, setCategory] = useState<"masterpiece" | "inspiration">("inspiration");
  const [sourceType, setSourceType] = useState<"pinterest" | "instagram" | "studio" | "web">("pinterest");
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  // Instagram Sync State
  const [isSyncing, setIsSyncing] = useState(false);

  // Batch Image URLs State
  const [batchUrls, setBatchUrls] = useState("");
  const [batchStyle, setBatchStyle] = useState("Fine Line");
  const [batchPlacement, setBatchPlacement] = useState("Forearm");

  if (!isOpen) return null;

  // Auto-detect URL type on paste
  const handleUrlChange = (val: string) => {
    setSourceUrl(val);
    setPreviewImage(val);

    if (val.includes("instagram.com")) {
      setSourceType("instagram");
      if (!title) setTitle("Custom Inking from Instagram");
    } else if (val.includes("pinterest.com") || val.includes("pinimg.com")) {
      setSourceType("pinterest");
      if (!title) setTitle("Pinterest Design Inspiration");
    } else {
      setSourceType("web");
      if (!title) setTitle("Custom Tattoo Concept");
    }
  };

  const handleImportSingle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceUrl.trim()) {
      toast.error("Please enter an image or post URL");
      return;
    }

    setIsProcessing(true);
    const finalTitle = title.trim() || (sourceType === "instagram" ? "Instagram Tattoo Post" : "Tattoo Inspiration Piece");
    const finalDesc = description.trim() || `Curated tattoo design featuring ${primaryStyle} linework for ${placement}.`;

    try {
      if (category === "masterpiece") {
        await portfolioService.createPortfolioItem({
          title: finalTitle,
          description: finalDesc,
          image: previewImage || sourceUrl,
          healed_image: null,
          style_tags: [primaryStyle, "Custom"],
          primary_style: primaryStyle,
          placement,
          color_type: "Black & Grey",
          session_hours: 4,
          is_featured: true,
          is_published: true,
          artist_name: "Jainik Patel",
          artist_id: "jainik-patel",
        });
      } else {
        await inspirationService.addInspiration({
          title: finalTitle,
          description: finalDesc,
          image: previewImage || sourceUrl,
          source: sourceType,
          source_url: sourceUrl,
          style_tags: [primaryStyle, "Custom"],
          primary_style: primaryStyle,
          placement,
          aspect_ratio: "portrait",
          is_trending: true,
        });
      }

      toast.success("Tattoo design successfully added to portfolio!");
      onImportSuccess();
      onClose();
      setSourceUrl("");
      setTitle("");
      setDescription("");
      setPreviewImage("");
    } catch (err) {
      toast.error("Failed to import tattoo");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSyncInstagram = async () => {
    setIsSyncing(true);
    toast.loading("Syncing latest posts from @tatoo.iconic...", { id: "dash-sync" });
    const res = await instagramService.triggerSync();
    setIsSyncing(false);

    if (res.success) {
      toast.success("Instagram feed synced successfully!", { id: "dash-sync" });
      onImportSuccess();
    } else {
      toast.error("Failed to sync with Instagram", { id: "dash-sync" });
    }
  };

  const handleBatchImport = async (e: React.FormEvent) => {
    e.preventDefault();
    const lines = batchUrls
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.startsWith("http"));

    if (lines.length === 0) {
      toast.error("Please paste at least one valid image URL per line");
      return;
    }

    setIsProcessing(true);
    let count = 0;

    for (const url of lines) {
      const isIg = url.includes("instagram.com");
      const isPin = url.includes("pinterest.com") || url.includes("pinimg.com");

      await inspirationService.addInspiration({
        title: `${batchStyle} Motif #${Math.floor(Math.random() * 900 + 100)}`,
        description: `Bespoke curated ${batchStyle} tattoo reference suitable for ${batchPlacement}.`,
        image: url,
        source: isIg ? "instagram" : isPin ? "pinterest" : "web",
        source_url: url,
        style_tags: [batchStyle, "Inspiration"],
        primary_style: batchStyle,
        placement: batchPlacement,
        aspect_ratio: "portrait",
      });
      count++;
    }

    setIsProcessing(false);
    toast.success(`Successfully imported ${count} tattoo designs!`);
    onImportSuccess();
    onClose();
    setBatchUrls("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl">
      <div className="relative w-full max-w-2xl rounded-3xl border border-amber-500/30 bg-ink-950 p-6 sm:p-8 shadow-2xl text-left overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 h-8 w-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-ink-300 hover:text-white"
        >
          <X size={16} />
        </button>

        <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-widest">
          <Sparkles size={15} />
          <span>Universal Portfolio Importer</span>
        </div>

        <h3 className="font-display text-2xl font-bold text-white mt-1">
          Import Tattoos from Instagram, Pinterest &amp; Web
        </h3>
        <p className="text-xs text-ink-300 mt-1">
          Easily expand your portfolio and inspiration vault with high-definition artwork from any source.
        </p>

        {/* Tab Navigation */}
        <div className="flex rounded-xl bg-ink-900 p-1 border border-white/10 mt-6 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("link")}
            className={`flex-1 py-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "link"
                ? "bg-amber-500 text-ink-950 shadow-md"
                : "text-ink-300 hover:text-white"
            }`}
          >
            <LinkIcon size={14} />
            <span>1-Click Link Importer</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("instagram")}
            className={`flex-1 py-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "instagram"
                ? "bg-fuchsia-600 text-white shadow-md"
                : "text-ink-300 hover:text-white"
            }`}
          >
            <Instagram size={14} />
            <span>Instagram Auto-Sync</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("batch")}
            className={`flex-1 py-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "batch"
                ? "bg-brand text-white shadow-md"
                : "text-ink-300 hover:text-white"
            }`}
          >
            <Upload size={14} />
            <span>Batch Multi-URL</span>
          </button>
        </div>

        {/* ── TAB 1: 1-Click Link Importer ── */}
        {activeTab === "link" && (
          <form onSubmit={handleImportSingle} className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-bold text-ink-200 uppercase tracking-wider block mb-1.5">
                Paste Instagram Post, Pinterest Image, or Direct URL
              </label>
              <input
                value={sourceUrl}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="e.g. https://www.instagram.com/p/... or https://i.pinimg.com/..."
                className="input-field text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-ink-200 uppercase tracking-wider block mb-1.5">
                  Tattoo Title
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Lord Shiva Trishul & Crescent"
                  className="input-field text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-ink-200 uppercase tracking-wider block mb-1.5">
                  Primary Style
                </label>
                <select
                  value={primaryStyle}
                  onChange={(e) => setPrimaryStyle(e.target.value)}
                  className="input-field text-xs"
                >
                  <option value="Spiritual">Spiritual Realism</option>
                  <option value="Fine Line">Fine Line</option>
                  <option value="Realism">Dark Realism</option>
                  <option value="Minimalist">Minimalist</option>
                  <option value="Geometric">Sacred Geometry</option>
                  <option value="Script">Devotional Script</option>
                  <option value="Traditional">Traditional</option>
                  <option value="Cover-up">Cover-up</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-ink-200 uppercase tracking-wider block mb-1.5">
                  Placement Area
                </label>
                <select
                  value={placement}
                  onChange={(e) => setPlacement(e.target.value)}
                  className="input-field text-xs"
                >
                  <option value="Forearm">Forearm</option>
                  <option value="Full Sleeve">Full Sleeve</option>
                  <option value="Bicep">Bicep &amp; Shoulder</option>
                  <option value="Spine">Spine &amp; Back</option>
                  <option value="Chest">Chest / Sternum</option>
                  <option value="Wrist">Wrist / Hand</option>
                  <option value="Collarbone">Collarbone</option>
                  <option value="Thigh">Thigh / Leg</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-ink-200 uppercase tracking-wider block mb-1.5">
                  Publish Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="input-field text-xs"
                >
                  <option value="inspiration">Pinterest Inspiration Vault</option>
                  <option value="masterpiece">Jainik's Masterpiece Portfolio</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="btn-primary w-full py-3.5 text-xs font-bold flex items-center justify-center gap-2 mt-2"
            >
              <Plus size={16} />
              <span>{isProcessing ? "Importing..." : "Save & Publish to Live Portfolio"}</span>
            </button>
          </form>
        )}

        {/* ── TAB 2: Instagram Live Sync ── */}
        {activeTab === "instagram" && (
          <div className="mt-6 space-y-5 text-center sm:text-left">
            <div className="rounded-2xl border border-fuchsia-500/30 bg-fuchsia-500/10 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-amber-500 to-fuchsia-600 p-0.5 shrink-0">
                  <div className="h-full w-full rounded-xl bg-ink-950 flex items-center justify-center text-white">
                    <Instagram size={22} />
                  </div>
                </div>
                <div>
                  <h4 className="font-display text-base font-bold text-white">
                    Connected to @tatoo.iconic
                  </h4>
                  <p className="text-xs text-ink-300">
                    Live Meta API connection active · Auto-refreshes new posts
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSyncInstagram}
                disabled={isSyncing}
                className="rounded-xl bg-gradient-to-r from-fuchsia-600 to-rose-600 hover:opacity-90 text-white font-bold text-xs py-2.5 px-4 flex items-center gap-2 transition-all cursor-pointer shadow-lg"
              >
                <RefreshCw size={14} className={isSyncing ? "animate-spin" : ""} />
                <span>{isSyncing ? "Syncing..." : "Sync Latest Posts Now"}</span>
              </button>
            </div>

            <div className="space-y-2 text-xs text-ink-300">
              <p className="flex items-center gap-2 text-emerald-400 font-semibold">
                <CheckCircle2 size={15} />
                <span>Instagram posts automatically appear on your website portfolio &amp; live wall</span>
              </p>
              <p className="flex items-center gap-2 text-emerald-400 font-semibold">
                <CheckCircle2 size={15} />
                <span>Visitors can browse full-res reels and photos without needing an Instagram account</span>
              </p>
            </div>
          </div>
        )}

        {/* ── TAB 3: Batch Multi-URL ── */}
        {activeTab === "batch" && (
          <form onSubmit={handleBatchImport} className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-bold text-ink-200 uppercase tracking-wider block mb-1.5">
                Paste Multiple Image URLs (One URL per line)
              </label>
              <textarea
                rows={4}
                value={batchUrls}
                onChange={(e) => setBatchUrls(e.target.value)}
                placeholder="https://images.unsplash.com/...&#10;https://i.pinimg.com/...&#10;https://instagram.com/..."
                className="input-field text-xs font-mono"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-ink-200 uppercase tracking-wider block mb-1.5">
                  Batch Style Tag
                </label>
                <select
                  value={batchStyle}
                  onChange={(e) => setBatchStyle(e.target.value)}
                  className="input-field text-xs"
                >
                  <option value="Spiritual">Spiritual Realism</option>
                  <option value="Fine Line">Fine Line</option>
                  <option value="Realism">Dark Realism</option>
                  <option value="Minimalist">Minimalist</option>
                  <option value="Geometric">Sacred Geometry</option>
                  <option value="Traditional">Traditional</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-ink-200 uppercase tracking-wider block mb-1.5">
                  Batch Placement
                </label>
                <select
                  value={batchPlacement}
                  onChange={(e) => setBatchPlacement(e.target.value)}
                  className="input-field text-xs"
                >
                  <option value="Forearm">Forearm</option>
                  <option value="Sleeve">Full Sleeve</option>
                  <option value="Back">Spine &amp; Back</option>
                  <option value="Chest">Chest</option>
                  <option value="Wrist">Wrist</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="btn-primary w-full py-3.5 text-xs font-bold flex items-center justify-center gap-2 mt-2"
            >
              <Upload size={16} />
              <span>{isProcessing ? "Importing Batch..." : "Import All Images into Inspiration Vault"}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
