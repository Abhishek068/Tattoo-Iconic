"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Plus,
  Trash2,
  Edit2,
  Sparkles,
  Upload,
  X,
  CheckCircle2,
  Eye,
  EyeOff,
  Link as LinkIcon,
  Instagram,
  Grid,
  RefreshCw,
  Image as ImageIcon,
} from "lucide-react";
import { portfolioService } from "@/services/portfolioService";
import { inspirationService } from "@/services/inspirationService";
import { QuickImporterModal } from "@/components/dashboard/QuickImporterModal";
import type { PortfolioItem, InspirationItem } from "@/types";
import toast from "react-hot-toast";

export default function PortfolioManagerPage() {
  const [activeTab, setActiveTab] = useState<"masterpieces" | "inspiration">("masterpieces");
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [inspirations, setInspirations] = useState<InspirationItem[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [importerOpen, setImporterOpen] = useState(false);

  // New Piece Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [primaryStyle, setPrimaryStyle] = useState("Fine Line");
  const [placement, setPlacement] = useState("Forearm");
  const [colorType, setColorType] = useState<PortfolioItem["color_type"]>("Black & Grey");
  const [sessionHours, setSessionHours] = useState<number>(4);
  const [isFeatured, setIsFeatured] = useState(true);

  const loadData = () => {
    portfolioService.getPortfolio().then(setItems);
    inspirationService.getInspirations().then(setInspirations);
  };

  useEffect(() => {
    loadData();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !description) {
      toast.error("Please enter a title and description.");
      return;
    }

    const newPiece = await portfolioService.createPortfolioItem({
      title,
      description,
      image: imageUrl || "/images/tattoos/hanuman-tattoo.png",
      healed_image: null,
      style_tags: [primaryStyle, "Custom"],
      primary_style: primaryStyle,
      placement,
      color_type: colorType,
      session_hours: sessionHours,
      is_featured: isFeatured,
      is_published: true,
      artist_name: "Jainik Patel",
      artist_id: "jainik-patel",
    });

    setItems([newPiece, ...items]);
    setModalOpen(false);
    toast.success("New tattoo piece published to live portfolio!");

    setTitle("");
    setDescription("");
    setImageUrl("");
  }

  async function handleTogglePublish(id: string, current: boolean) {
    const updated = await portfolioService.updatePortfolioItem(id, { is_published: !current });
    if (updated) {
      setItems((prev) => prev.map((i) => (i.id === id ? updated : i)));
      toast.success(updated.is_published ? "Piece published" : "Piece hidden from public");
    }
  }

  async function handleDelete(id: string) {
    if (confirm("Are you sure you want to remove this piece from the portfolio?")) {
      await portfolioService.deletePortfolioItem(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      toast.success("Piece deleted from portfolio archive.");
    }
  }

  async function handleDeleteInspiration(id: string) {
    if (confirm("Delete this inspiration reference from the vault?")) {
      await inspirationService.deleteInspiration(id);
      setInspirations((prev) => prev.filter((i) => i.id !== id));
      toast.success("Inspiration design removed.");
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl text-white font-bold">
            Portfolio &amp; Inspiration Manager
          </h2>
          <p className="text-xs sm:text-sm text-ink-300 mt-1">
            Manage your custom masterworks, sync Instagram posts, and import Pinterest inspiration boards.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setImporterOpen(true)}
            className="rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 px-4 py-2.5 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <LinkIcon size={15} className="text-amber-400" />
            <span>Import Instagram / Pinterest</span>
          </button>

          <button
            onClick={() => setModalOpen(true)}
            className="btn-primary text-xs sm:text-sm py-2.5 px-5 flex items-center gap-2"
          >
            <Plus size={16} />
            <span>Add Studio Masterwork</span>
          </button>
        </div>
      </div>

      {/* Navigation Switcher Tabs */}
      <div className="flex rounded-xl bg-ink-900 p-1.5 border border-white/10 max-w-md text-xs">
        <button
          onClick={() => setActiveTab("masterpieces")}
          className={`flex-1 py-2 rounded-lg font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "masterpieces"
              ? "bg-brand text-white shadow-md"
              : "text-ink-300 hover:text-white"
          }`}
        >
          <Sparkles size={14} />
          <span>👑 Masterpieces ({items.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("inspiration")}
          className={`flex-1 py-2 rounded-lg font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "inspiration"
              ? "bg-amber-500 text-ink-950 shadow-md font-bold"
              : "text-ink-300 hover:text-white"
          }`}
        >
          <Grid size={14} />
          <span>📌 Inspiration Vault ({inspirations.length})</span>
        </button>
      </div>

      {/* ── VIEW 1: Masterpieces Grid ── */}
      {activeTab === "masterpieces" && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="glass-card overflow-hidden p-0 border-white/15 flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-square bg-ink-950">
                  <Image src={item.image} alt={item.title} fill className="object-cover" />
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <span className="rounded-full bg-ink-950/80 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-md">
                      {item.placement}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                        item.is_published
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                          : "bg-red-500/20 text-red-300"
                      }`}
                    >
                      {item.is_published ? "Live" : "Draft"}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-base font-bold text-white truncate">
                      {item.title}
                    </h3>
                    {item.is_featured && (
                      <span className="rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] px-1.5 py-0.5 font-bold shrink-0">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-ink-300 line-clamp-2">{item.description}</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.style_tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] text-amber-200"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-4 border-t border-white/10 flex items-center justify-between bg-white/[0.02]">
                <button
                  onClick={() => handleTogglePublish(item.id, item.is_published)}
                  className="text-xs text-ink-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
                >
                  {item.is_published ? <EyeOff size={14} /> : <Eye size={14} />}
                  <span>{item.is_published ? "Unpublish" : "Publish"}</span>
                </button>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── VIEW 2: Pinterest & Inspiration Vault Grid ── */}
      {activeTab === "inspiration" && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {inspirations.map((insp) => (
            <div
              key={insp.id}
              className="glass-card overflow-hidden p-0 border-white/15 flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[4/3] bg-ink-950">
                  <Image src={insp.image} alt={insp.title} fill className="object-cover" />
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <span className="rounded-full bg-ink-950/80 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-md">
                      {insp.placement}
                    </span>
                    <span className="rounded-full bg-amber-500/30 border border-amber-400/40 text-amber-200 px-2.5 py-1 text-[10px] font-bold uppercase">
                      {insp.source}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="font-display text-base font-bold text-white truncate">
                    {insp.title}
                  </h3>
                  <p className="text-xs text-ink-300 line-clamp-2">{insp.description}</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {insp.style_tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] text-amber-200"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-4 border-t border-white/10 flex items-center justify-between bg-white/[0.02]">
                <span className="text-[11px] text-ink-400">
                  Style: <strong className="text-amber-300">{insp.primary_style}</strong>
                </span>

                <button
                  onClick={() => handleDeleteInspiration(insp.id)}
                  className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 size={14} />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add New Tattoo Work Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative max-w-lg w-full rounded-3xl border border-white/15 bg-ink-900 p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl text-white font-bold">
                Add New Studio Masterwork
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-full bg-white/10 text-ink-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-left">
              <div>
                <label className="label">Piece Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lord Shiva Cosmic Trishul"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input-field"
                />
              </div>

              <div>
                <label className="label">Description &amp; Technique</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe linework technique, shading density, needle specs..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input-field"
                />
              </div>

              <div>
                <label className="label">Image URL or Local Path</label>
                <input
                  type="text"
                  placeholder="/images/tattoos/... or https://..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="input-field"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Primary Style</label>
                  <select
                    value={primaryStyle}
                    onChange={(e) => setPrimaryStyle(e.target.value)}
                    className="input-field"
                  >
                    <option value="Spiritual">Spiritual Realism</option>
                    <option value="Fine Line">Fine Line</option>
                    <option value="Realism">Dark Realism</option>
                    <option value="Minimalist">Minimalist</option>
                    <option value="Geometric">Sacred Geometry</option>
                    <option value="Script">Devotional Script</option>
                    <option value="Traditional">Traditional</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>

                <div>
                  <label className="label">Placement</label>
                  <select
                    value={placement}
                    onChange={(e) => setPlacement(e.target.value)}
                    className="input-field"
                  >
                    <option value="Forearm">Forearm</option>
                    <option value="Full Sleeve">Full Sleeve</option>
                    <option value="Bicep">Bicep / Shoulder</option>
                    <option value="Spine">Spine / Back</option>
                    <option value="Chest">Chest</option>
                    <option value="Wrist">Wrist</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="btn-primary w-full py-3 text-xs sm:text-sm mt-4">
                Publish Masterpiece to Live Portfolio
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── Universal Quick Importer Modal (Instagram / Pinterest / Batch) ── */}
      <QuickImporterModal
        isOpen={importerOpen}
        onClose={() => setImporterOpen(false)}
        onImportSuccess={loadData}
      />
    </div>
  );
}
