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
  Search,
  Filter,
  Star,
  Tag,
  MapPin,
  Clock,
} from "lucide-react";
import { portfolioService } from "@/services/portfolio.service";
import type { PortfolioItem } from "@/types";
import toast from "react-hot-toast";

const STYLES = ["All", "Spiritual", "Fine Line", "Realism", "Blackwork", "Minimalist", "Script", "Geometric", "Custom"];
const PLACEMENTS = ["All", "Forearm", "Bicep", "Shoulder", "Spine", "Chest", "Collarbone", "Full Sleeve", "Wrist"];

export default function ArtistPortfolioManagerPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [search, setSearch] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("All");
  const [selectedPlacement, setSelectedPlacement] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [primaryStyle, setPrimaryStyle] = useState("Fine Line");
  const [placement, setPlacement] = useState("Forearm");
  const [colorType, setColorType] = useState<PortfolioItem["color_type"]>("Black & Grey");
  const [sessionHours, setSessionHours] = useState<number>(4);
  const [isFeatured, setIsFeatured] = useState(true);
  const [clientStory, setClientStory] = useState("");

  const loadData = () => {
    portfolioService
      .getAll({
        style: selectedStyle,
        placement: selectedPlacement,
        search,
      })
      .then(setItems);
  };

  useEffect(() => {
    loadData();
  }, [selectedStyle, selectedPlacement, search]);

  function resetForm() {
    setTitle("");
    setDescription("");
    setImageUrl("");
    setPrimaryStyle("Fine Line");
    setPlacement("Forearm");
    setColorType("Black & Grey");
    setSessionHours(4);
    setIsFeatured(true);
    setClientStory("");
    setEditingItem(null);
  }

  function openEditModal(item: PortfolioItem) {
    setEditingItem(item);
    setTitle(item.title);
    setDescription(item.description);
    setImageUrl(item.image);
    setPrimaryStyle(item.primary_style);
    setPlacement(item.placement);
    setColorType(item.color_type);
    setSessionHours(item.session_hours || 4);
    setIsFeatured(item.is_featured);
    setClientStory(item.client_story || "");
    setModalOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error("Please enter a title and description.");
      return;
    }

    if (editingItem) {
      await portfolioService.update(editingItem.id, {
        title,
        description,
        image: imageUrl || editingItem.image,
        healed_image: imageUrl || editingItem.image,
        style_tags: [primaryStyle, "Custom"],
        primary_style: primaryStyle,
        placement,
        color_type: colorType,
        session_hours: sessionHours,
        is_featured: isFeatured,
        client_story: clientStory,
      });
      toast.success("Tattoo masterpiece updated!");
    } else {
      await portfolioService.create({
        title,
        description,
        image: imageUrl || "/images/tattoos/shiva-trishul-tattoo.jpg",
        healed_image: imageUrl || "/images/tattoos/shiva-trishul-tattoo.jpg",
        style_tags: [primaryStyle, "Custom"],
        primary_style: primaryStyle,
        placement,
        color_type: colorType,
        session_hours: sessionHours,
        is_featured: isFeatured,
        is_published: true,
        artist_name: "Jainik Patel",
        artist_id: "jainik-patel",
        client_story: clientStory || "Crafted at Tattoo Iconic Atelier",
      });
      toast.success("New tattoo piece published to portfolio!");
    }

    setModalOpen(false);
    resetForm();
    loadData();
  }

  async function handleDelete(id: string) {
    if (confirm("Are you sure you want to remove this piece from the portfolio?")) {
      await portfolioService.delete(id);
      toast.success("Piece removed.");
      loadData();
    }
  }

  async function togglePublish(item: PortfolioItem) {
    await portfolioService.update(item.id, { is_published: !item.is_published });
    toast.success(item.is_published ? "Piece hidden from public site." : "Piece published to public site.");
    loadData();
  }

  async function toggleFeatured(item: PortfolioItem) {
    await portfolioService.update(item.id, { is_featured: !item.is_featured });
    toast.success(item.is_featured ? "Removed from featured carousel." : "Added to featured showcase!");
    loadData();
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl text-white font-bold tracking-wide">
            Portfolio Management
          </h2>
          <p className="text-xs sm:text-sm text-[#8e90a0] mt-1">
            Publish, curate, edit, and categorize your masterworks on the public portfolio.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setModalOpen(true);
          }}
          className="rounded-xl bg-gradient-to-r from-[#c5a059] to-[#d8b467] px-5 py-2.5 font-serif font-bold text-xs text-[#0a0a0a] tracking-wider uppercase shadow-lg shadow-amber-500/20 hover:brightness-110 transition-all inline-flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Plus size={16} />
          <span>Add Tattoo Piece</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="rounded-2xl border border-white/10 bg-[#0d0f14]/80 backdrop-blur-xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:max-w-xs">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8e90a0]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, style, or story..."
            className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-2 text-xs text-white placeholder:text-[#525463] focus:border-amber-400 focus:outline-none"
          />
        </div>

        {/* Style Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1 md:pb-0">
          {STYLES.map((style) => (
            <button
              key={style}
              onClick={() => setSelectedStyle(style)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                selectedStyle === style
                  ? "bg-amber-500/20 border border-amber-500/40 text-amber-300"
                  : "border border-white/5 bg-white/5 text-[#8e90a0] hover:text-white"
              }`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      {/* Portfolio Items Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.id}
            className={`rounded-2xl border overflow-hidden transition-all flex flex-col justify-between ${
              item.is_published
                ? "border-white/10 bg-[#0d0f14]/80 hover:border-amber-400/40"
                : "border-white/5 bg-white/[0.02] opacity-60"
            }`}
          >
            {/* Image Preview Container */}
            <div className="relative aspect-[4/5] w-full bg-[#12141c] overflow-hidden group">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Status Badges */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                <span className="rounded-md bg-black/70 backdrop-blur-md px-2 py-0.5 text-[10px] font-semibold text-amber-300 border border-amber-400/30">
                  {item.primary_style}
                </span>

                <div className="flex items-center gap-1.5 pointer-events-auto">
                  {item.is_featured && (
                    <span className="rounded-md bg-amber-500/90 text-black px-1.5 py-0.5 text-[10px] font-bold flex items-center gap-1 shadow-md">
                      <Star size={10} className="fill-black" />
                      Featured
                    </span>
                  )}
                  {!item.is_published && (
                    <span className="rounded-md bg-red-500/80 text-white px-2 py-0.5 text-[10px] font-bold">
                      Hidden
                    </span>
                  )}
                </div>
              </div>

              {/* Quick Hover Controls */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2.5 pointer-events-auto">
                <button
                  onClick={() => openEditModal(item)}
                  className="p-2.5 rounded-full bg-white/10 hover:bg-amber-400 hover:text-black text-white backdrop-blur-md transition-colors"
                  title="Edit Details"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => togglePublish(item)}
                  className="p-2.5 rounded-full bg-white/10 hover:bg-white text-white hover:text-black backdrop-blur-md transition-colors"
                  title={item.is_published ? "Hide from public" : "Publish to site"}
                >
                  {item.is_published ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                <button
                  onClick={() => toggleFeatured(item)}
                  className="p-2.5 rounded-full bg-white/10 hover:bg-amber-400 hover:text-black text-white backdrop-blur-md transition-colors"
                  title={item.is_featured ? "Unfeature" : "Feature piece"}
                >
                  <Star size={16} className={item.is_featured ? "fill-amber-300" : ""} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2.5 rounded-full bg-white/10 hover:bg-red-500 hover:text-white text-red-400 backdrop-blur-md transition-colors"
                  title="Delete Piece"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Meta Details */}
            <div className="p-4 space-y-2">
              <h3 className="font-serif text-sm font-bold text-white line-clamp-1">
                {item.title}
              </h3>
              <p className="text-[11px] text-[#8e90a0] line-clamp-2 leading-relaxed">
                {item.description}
              </p>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-[#8e90a0]">
                <span className="flex items-center gap-1">
                  <MapPin size={11} className="text-amber-400" />
                  {item.placement}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={11} />
                  {item.session_hours || 4}h session
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Add / Edit Tattoo Modal ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="rounded-2xl border border-white/15 bg-[#0e1017] w-full max-w-xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="font-serif text-lg font-bold text-white">
                {editingItem ? "Edit Tattoo Piece" : "Add New Tattoo Piece"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-[#8e90a0] hover:text-white p-1"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#cacad3] mb-1.5">
                  Piece Title
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Lord Shiva Trishul & Sacred Damru"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                  required
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#cacad3] mb-1.5">
                    Primary Style
                  </label>
                  <select
                    value={primaryStyle}
                    onChange={(e) => setPrimaryStyle(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#141722] px-3 py-2.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                  >
                    {STYLES.filter((s) => s !== "All").map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#cacad3] mb-1.5">
                    Body Placement
                  </label>
                  <input
                    value={placement}
                    onChange={(e) => setPlacement(e.target.value)}
                    placeholder="e.g. Forearm, Spine, Bicep"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#cacad3] mb-1.5">
                  Image URL / Asset Path
                </label>
                <input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="e.g. /images/tattoos/shiva-trishul-tattoo.jpg or https://..."
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white focus:border-amber-400 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#cacad3] mb-1.5">
                  Artwork Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the aesthetic, technique, and symbolism..."
                  rows={3}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#cacad3] mb-1.5">
                  Client Story / Studio Context
                </label>
                <input
                  value={clientStory}
                  onChange={(e) => setClientStory(e.target.value)}
                  placeholder="e.g. Inked for a Mahadev devotee during a private studio session."
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <label className="flex items-center gap-2 text-xs text-[#cacad3] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded border-white/20 bg-white/5 text-amber-500 focus:ring-0"
                  />
                  <span>Feature on Homepage / Showcase Carousel</span>
                </label>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-white/10 px-4 py-2 text-xs text-[#8e90a0] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-[#c5a059] to-[#d8b467] px-6 py-2 text-xs font-bold text-[#0a0a0a] uppercase tracking-wider"
                >
                  {editingItem ? "Update Piece" : "Publish Piece"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
