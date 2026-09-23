"use client";

import { useState, useEffect } from "react";
import {
  Scissors,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  DollarSign,
  Clock,
  Sparkles,
  Home,
  ShieldCheck,
  X,
  RefreshCw,
} from "lucide-react";
import { serviceService } from "@/services/service.service";
import type { ServiceOffering } from "@/types";
import toast from "react-hot-toast";

export default function ArtistServicesPage() {
  const [services, setServices] = useState<ServiceOffering[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceOffering | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [fullDesc, setFullDesc] = useState("");
  const [startingPrice, setStartingPrice] = useState(2500);
  const [hourlyRate, setHourlyRate] = useState(1500);
  const [duration, setDuration] = useState("3 to 6 Hours");
  const [serviceType, setServiceType] = useState<ServiceOffering["service_type"]>("studio");

  const loadData = () => {
    serviceService.getAll().then(setServices);
  };

  useEffect(() => {
    loadData();
  }, []);

  function resetForm() {
    setTitle("");
    setSlug("");
    setShortDesc("");
    setFullDesc("");
    setStartingPrice(2500);
    setHourlyRate(1500);
    setDuration("3 to 6 Hours");
    setServiceType("studio");
    setEditingService(null);
  }

  function openEditModal(srv: ServiceOffering) {
    setEditingService(srv);
    setTitle(srv.title);
    setSlug(srv.slug);
    setShortDesc(srv.short_desc);
    setFullDesc(srv.full_desc);
    setStartingPrice(srv.starting_price || 2500);
    setHourlyRate(srv.hourly_rate || 1500);
    setDuration(srv.estimated_duration);
    setServiceType(srv.service_type);
    setModalOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !shortDesc.trim()) {
      toast.error("Please fill in title and description.");
      return;
    }

    if (editingService) {
      await serviceService.update(editingService.id, {
        title,
        slug: slug || title.toLowerCase().replace(/\s+/g, "-"),
        short_desc: shortDesc,
        full_desc: fullDesc,
        starting_price: startingPrice,
        hourly_rate: hourlyRate,
        estimated_duration: duration,
        service_type: serviceType,
      });
      toast.success("Service offering updated!");
    } else {
      await serviceService.create({
        slug: slug || title.toLowerCase().replace(/\s+/g, "-"),
        title,
        short_desc: shortDesc,
        full_desc: fullDesc,
        suitable_for: ["Custom collectors"],
        process_steps: ["Consultation", "Stencil", "Execution", "Aftercare"],
        estimated_duration: duration,
        price_model: "Fixed Starting",
        starting_price: startingPrice,
        hourly_rate: hourlyRate,
        service_type: serviceType,
        image: "/images/tattoos/shiva-trishul-tattoo.jpg",
        icon: serviceType === "home" ? "Home" : "Sparkles",
        features: ["100% Sterile Protocol", "Custom Stencil"],
        is_active: true,
      });
      toast.success("New service offering added!");
    }

    setModalOpen(false);
    resetForm();
    loadData();
  }

  async function toggleActive(srv: ServiceOffering) {
    await serviceService.update(srv.id, { is_active: !srv.is_active });
    toast.success(srv.is_active ? "Service disabled temporarily" : "Service activated on booking page");
    loadData();
  }

  async function handleDelete(id: string) {
    if (confirm("Are you sure you want to remove this service?")) {
      await serviceService.delete(id);
      toast.success("Service removed.");
      loadData();
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl text-white font-bold tracking-wide">
            Services &amp; Pricing Catalog
          </h2>
          <p className="text-xs sm:text-sm text-[#8e90a0] mt-1">
            Configure private atelier rates, luxury home service travel terms, and starting prices.
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
          <span>Add New Service</span>
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {services.map((srv) => (
          <div
            key={srv.id}
            className={`rounded-2xl border p-6 space-y-5 transition-all flex flex-col justify-between ${
              srv.is_active !== false
                ? "border-white/10 bg-[#0d0f14]/80 hover:border-amber-400/30"
                : "border-white/5 bg-white/[0.02] opacity-60"
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300">
                    {srv.service_type === "home" ? <Home size={20} /> : <Sparkles size={20} />}
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-white">
                      {srv.title}
                    </h3>
                    <span className="text-[10px] text-amber-300 uppercase tracking-widest font-semibold block">
                      {srv.service_type === "home" ? "Luxury Home Visit" : "Bhadam Atelier Visit"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(srv)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[#8e90a0] hover:text-white transition-colors"
                    title="Edit Service"
                  >
                    <Edit2 size={15} />
                  </button>
                  <button
                    onClick={() => toggleActive(srv)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-colors ${
                      srv.is_active !== false
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : "bg-red-500/20 text-red-300 border border-red-500/30"
                    }`}
                  >
                    {srv.is_active !== false ? "Active" : "Disabled"}
                  </button>
                </div>
              </div>

              <p className="text-xs text-[#8e90a0] leading-relaxed">
                {srv.short_desc}
              </p>

              {/* Pricing Breakdown Cards */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="rounded-xl border border-white/5 bg-[#12141c] p-3 text-xs">
                  <span className="block text-[10px] text-[#525463] uppercase font-bold">Starting Base</span>
                  <strong className="text-base font-serif text-emerald-400">₹{srv.starting_price || 2500}</strong>
                </div>

                <div className="rounded-xl border border-white/5 bg-[#12141c] p-3 text-xs">
                  <span className="block text-[10px] text-[#525463] uppercase font-bold">Hourly Rate</span>
                  <strong className="text-base font-serif text-amber-300">₹{srv.hourly_rate || 1500}/hr</strong>
                </div>
              </div>

              {/* Key Features List */}
              <div className="space-y-1.5 pt-2">
                {srv.features?.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-[#a3a4b2]">
                    <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-[#747688]">
              <span className="flex items-center gap-1">
                <Clock size={12} /> {srv.estimated_duration}
              </span>
              <span className="font-mono text-[10px]">/{srv.slug}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Add / Edit Modal ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="rounded-2xl border border-white/15 bg-[#0e1017] w-full max-w-lg p-6 sm:p-8 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="font-serif text-lg font-bold text-white">
                {editingService ? "Edit Service Offering" : "Add New Service Offering"}
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
                <label className="block text-xs font-semibold text-[#cacad3] mb-1">
                  Service Title
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Master Dark Realism Session"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#cacad3] mb-1">
                    Service Mode
                  </label>
                  <select
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value as any)}
                    className="w-full rounded-xl border border-white/10 bg-[#141722] px-3 py-2.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                  >
                    <option value="studio">Private Studio</option>
                    <option value="home">Luxury Home Visit</option>
                    <option value="consultation">Consultation Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#cacad3] mb-1">
                    Estimated Duration
                  </label>
                  <input
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 4 to 7 Hours"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#cacad3] mb-1">
                    Starting Base Price (₹)
                  </label>
                  <input
                    type="number"
                    value={startingPrice}
                    onChange={(e) => setStartingPrice(Number(e.target.value))}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#cacad3] mb-1">
                    Hourly Rate (₹/hr)
                  </label>
                  <input
                    type="number"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(Number(e.target.value))}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#cacad3] mb-1">
                  Short Summary
                </label>
                <textarea
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  rows={2}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                  required
                />
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end gap-3">
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
                  {editingService ? "Save Changes" : "Create Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
