"use client";

import { useState, useEffect } from "react";
import {
  FileSpreadsheet,
  ExternalLink,
  Search,
  Filter,
  MessageCircle,
  Phone,
  Mail,
  Calendar,
  Sparkles,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertCircle,
  User,
  Info,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { enquiryService } from "@/services/enquiry.service";
import { whatsappService } from "@/services/whatsapp.service";
import type { TattooEnquiry, EnquiryStatus } from "@/types";
import toast from "react-hot-toast";

const STATUS_OPTIONS: (EnquiryStatus | "ALL")[] = [
  "ALL",
  "NEW",
  "CONTACTED",
  "CONSULTATION",
  "BOOKED",
  "COMPLETED",
  "DECLINED",
  "CANCELLED",
];

const STATUS_COLORS: Record<EnquiryStatus, string> = {
  NEW: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  CONTACTED: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  CONSULTATION: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  BOOKED: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  COMPLETED: "bg-emerald-600/20 text-emerald-200 border-emerald-600/30",
  DECLINED: "bg-red-500/20 text-red-300 border-red-500/30",
  CANCELLED: "bg-ink-700/50 text-ink-300 border-ink-600/30",
};

export default function EnquiriesDashboardPage() {
  const [enquiries, setEnquiries] = useState<TattooEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<EnquiryStatus | "ALL">("ALL");
  const [activeEnquiry, setActiveEnquiry] = useState<TattooEnquiry | null>(null);

  const googleSheetUrl =
    process.env.NEXT_PUBLIC_GOOGLE_SHEET_URL ||
    "https://docs.google.com/spreadsheets";

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const data = await enquiryService.getEnquiries();
      setEnquiries(data);
    } catch (err) {
      toast.error("Failed to load enquiries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const filteredEnquiries = enquiries.filter((item) => {
    const matchesStatus = selectedStatus === "ALL" || item.status === selectedStatus;
    const matchesSearch =
      !search.trim() ||
      item.client_id.toLowerCase().includes(search.toLowerCase()) ||
      item.full_name.toLowerCase().includes(search.toLowerCase()) ||
      item.phone.toLowerCase().includes(search.toLowerCase()) ||
      item.tattoo_idea.toLowerCase().includes(search.toLowerCase()) ||
      item.tattoo_style.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* ── Top Header Banner ── */}
      <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 via-ink-900 to-ink-950 p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-300">
              <FileSpreadsheet size={14} />
              <span>Phase 1 Google Sheets Enquiries</span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl text-white font-bold tracking-tight">
              Customer Enquiries
            </h1>

            <p className="text-xs sm:text-sm text-ink-300 leading-relaxed">
              Enquiries submitted through the website are recorded into your administrative Google Sheet and linked with WhatsApp.
            </p>
          </div>

          {/* Action Button: OPEN GOOGLE SHEET */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={fetchEnquiries}
              disabled={loading}
              className="rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white px-4 py-3 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
            >
              <RefreshCw size={14} className={loading ? "animate-spin text-amber-400" : ""} />
              <span>Refresh</span>
            </button>

            <a
              href={googleSheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-bold text-xs py-3 px-5 flex items-center gap-2.5 shadow-xl shadow-emerald-950/50 transition-all cursor-pointer"
            >
              <FileSpreadsheet size={16} />
              <span>OPEN GOOGLE SHEET</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </div>

        {/* Informative Note Box */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-black/40 p-4 flex items-center gap-3 text-xs text-ink-300">
          <Info size={16} className="text-amber-400 shrink-0" />
          <span>
            <strong>Note:</strong> Enquiries are currently managed through Google Sheets. Use the button above to view and update master spreadsheet rows in real-time.
          </span>
        </div>
      </div>

      {/* ── Search & Filter Controls ── */}
      <div className="glass-card p-4 sm:p-5 border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Client ID, Name, Phone, or Tattoo Motif..."
              className="w-full rounded-xl border border-white/10 bg-ink-950/80 py-2.5 pl-10 pr-4 text-xs text-white placeholder-ink-400 focus:border-emerald-500 focus:outline-none transition-all"
            />
          </div>

          <div className="text-xs text-ink-300 flex items-center gap-2 shrink-0">
            <span>Showing</span>
            <strong className="text-white font-mono">{filteredEnquiries.length}</strong>
            <span>of</span>
            <strong className="text-white font-mono">{enquiries.length}</strong>
            <span>total records</span>
          </div>
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs border-t border-white/5 pt-3">
          <span className="text-[11px] font-bold text-ink-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <Filter size={12} /> Status:
          </span>
          {STATUS_OPTIONS.map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`rounded-lg px-3 py-1.5 font-medium transition-all shrink-0 cursor-pointer ${
                selectedStatus === status
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                  : "bg-white/5 text-ink-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* ── Enquiries Table ── */}
      {filteredEnquiries.length === 0 ? (
        <div className="glass-card p-12 text-center border-white/10">
          <FileSpreadsheet size={40} className="mx-auto text-emerald-400 mb-3 opacity-60" />
          <h3 className="text-base font-bold text-white">No enquiries match your filter</h3>
          <p className="text-xs text-ink-400 mt-1 max-w-sm mx-auto">
            Try resetting your search query or check your Google Sheet for newly submitted rows.
          </p>
          <button
            onClick={() => {
              setSearch("");
              setSelectedStatus("ALL");
            }}
            className="mt-4 rounded-xl bg-white/10 hover:bg-white/15 px-4 py-2 text-xs font-semibold text-white transition-all cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="glass-card border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-ink-300">
              <thead className="border-b border-white/10 bg-white/5 text-[11px] font-bold uppercase tracking-wider text-ink-400">
                <tr>
                  <th className="py-3.5 px-4">Client ID</th>
                  <th className="py-3.5 px-4">Customer Details</th>
                  <th className="py-3.5 px-4">Tattoo Concept</th>
                  <th className="py-3.5 px-4">Service &amp; Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredEnquiries.map((enquiry) => (
                  <tr
                    key={enquiry.client_id}
                    className="hover:bg-white/[0.03] transition-colors cursor-pointer"
                    onClick={() => setActiveEnquiry(enquiry)}
                  >
                    {/* Client ID */}
                    <td className="py-4 px-4 font-mono font-bold text-amber-300">
                      {enquiry.client_id}
                      <p className="text-[10px] text-ink-400 font-sans font-normal mt-0.5">
                        {new Date(enquiry.submitted_at).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </td>

                    {/* Customer */}
                    <td className="py-4 px-4">
                      <p className="font-bold text-white text-xs">{enquiry.full_name}</p>
                      <p className="text-[11px] text-ink-400 mt-0.5">{enquiry.phone}</p>
                      <p className="text-[10px] text-ink-500 truncate max-w-[160px]">
                        {enquiry.email}
                      </p>
                    </td>

                    {/* Tattoo Concept */}
                    <td className="py-4 px-4 max-w-xs">
                      <p className="font-semibold text-ink-200 line-clamp-1">{enquiry.tattoo_idea}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="rounded bg-amber-500/15 text-amber-300 px-1.5 py-0.5 text-[10px] font-medium border border-amber-500/30">
                          {enquiry.tattoo_style}
                        </span>
                        <span className="text-[10px] text-ink-400">{enquiry.placement}</span>
                        <span className="text-[10px] text-ink-500">({enquiry.approx_size})</span>
                      </div>
                    </td>

                    {/* Service & Date */}
                    <td className="py-4 px-4">
                      <span
                        className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold ${
                          enquiry.service_type === "Home Tattoo Service"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                            : "bg-white/10 text-ink-200"
                        }`}
                      >
                        {enquiry.service_type === "Home Tattoo Service" ? "🏠 Home Service" : "🏛️ Studio"}
                      </span>
                      <p className="text-[11px] text-ink-300 mt-1 flex items-center gap-1">
                        <Calendar size={11} className="text-amber-400" />
                        <span>{enquiry.preferred_date || "Flexible"}</span>
                      </p>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      <span
                        className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-wide ${
                          STATUS_COLORS[enquiry.status] || "bg-white/10 text-white"
                        }`}
                      >
                        {enquiry.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                      {enquiry.phone ? (
                        <a
                          href={whatsappService.generateArtistToClientUrl(
                            enquiry.phone,
                            enquiry.client_id,
                            enquiry.full_name
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 px-2.5 py-1.5 text-[11px] font-bold transition-all shadow-sm"
                          title="Chat with client on WhatsApp"
                        >
                          <MessageCircle size={13} />
                          <span>WhatsApp</span>
                        </a>
                      ) : enquiry.email ? (
                        <a
                          href={`mailto:${enquiry.email}?subject=${encodeURIComponent(`Tattoo Iconic Inquiry #${enquiry.client_id}`)}`}
                          className="inline-flex items-center gap-1 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 px-2.5 py-1.5 text-[11px] font-bold transition-all shadow-sm"
                          title="Email client"
                        >
                          <Mail size={13} />
                          <span>Email</span>
                        </a>
                      ) : (
                        <span className="text-[10px] text-ink-500">No Contact</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Detail Modal ── */}
      <AnimatePresence>
        {activeEnquiry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card w-full max-w-2xl border-white/15 p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-[11px] font-mono font-bold text-amber-300">
                    {activeEnquiry.client_id}
                  </span>
                  <h2 className="font-display text-2xl font-bold text-white mt-0.5">
                    {activeEnquiry.full_name}
                  </h2>
                  <p className="text-xs text-ink-400">
                    Submitted on {new Date(activeEnquiry.submitted_at).toLocaleString("en-IN")}
                  </p>
                </div>

                <button
                  onClick={() => setActiveEnquiry(null)}
                  className="rounded-full bg-white/10 hover:bg-white/20 p-2 text-white transition-all cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Grid of Details */}
              <div className="grid sm:grid-cols-2 gap-4 text-xs">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3.5 space-y-2">
                  <p className="font-bold text-white uppercase text-[10px] tracking-wider text-amber-300">
                    Customer Info
                  </p>
                  <p><strong>Phone:</strong> {activeEnquiry.phone || <span className="text-ink-500">Not provided</span>}</p>
                  <p><strong>Email:</strong> {activeEnquiry.email || <span className="text-ink-500">Not provided</span>}</p>
                  <p><strong>Service:</strong> {activeEnquiry.service_type}</p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-3.5 space-y-2">
                  <p className="font-bold text-white uppercase text-[10px] tracking-wider text-amber-300">
                    Tattoo Specs
                  </p>
                  <p><strong>Style:</strong> {activeEnquiry.tattoo_style}</p>
                  <p><strong>Placement:</strong> {activeEnquiry.placement}</p>
                  <p><strong>Size:</strong> {activeEnquiry.approx_size}</p>
                  <p><strong>Colour:</strong> {activeEnquiry.color_preference}</p>
                </div>
              </div>

              {/* Concept & Notes */}
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-ink-300">Tattoo Concept / Idea:</label>
                  <p className="mt-1 rounded-xl border border-white/10 bg-ink-950 p-3 text-white leading-relaxed">
                    {activeEnquiry.tattoo_idea}
                  </p>
                </div>

                {activeEnquiry.detailed_description && (
                  <div>
                    <label className="font-bold text-ink-300">Detailed Notes / Address:</label>
                    <p className="mt-1 rounded-xl border border-white/10 bg-ink-950 p-3 text-ink-200 leading-relaxed">
                      {activeEnquiry.detailed_description}
                    </p>
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                {activeEnquiry.phone ? (
                  <a
                    href={whatsappService.generateArtistToClientUrl(
                      activeEnquiry.phone,
                      activeEnquiry.client_id,
                      activeEnquiry.full_name
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-5 text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50"
                  >
                    <MessageCircle size={15} />
                    <span>Open WhatsApp with Client</span>
                  </a>
                ) : activeEnquiry.email ? (
                  <a
                    href={`mailto:${activeEnquiry.email}?subject=${encodeURIComponent(`Tattoo Iconic Inquiry #${activeEnquiry.client_id}`)}`}
                    className="w-full sm:w-auto rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-5 text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-950/50"
                  >
                    <Mail size={15} />
                    <span>Send Email to Client</span>
                  </a>
                ) : null}

                <a
                  href={googleSheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-ink-200 hover:text-white py-3 px-4 text-xs flex items-center justify-center gap-2"
                >
                  <FileSpreadsheet size={14} />
                  <span>Update in Google Sheet</span>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
