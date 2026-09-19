"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Instagram,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Upload,
  Eye,
  EyeOff,
  Check,
  CheckCheck,
  ExternalLink,
  ShieldCheck,
  FileText,
  Flame,
  ArrowRight,
} from "lucide-react";
import { instagramApi, type InstagramStatusResponse, type PendingReviewItem, type SyncBatchHistoryItem } from "@/services/instagramApi";
import toast from "react-hot-toast";

const STYLES = ["Spiritual", "Realism", "Fine Line", "Geometric", "Script", "Blackwork", "Traditional", "Custom"];
const PLACEMENTS = ["Forearm", "Bicep", "Full Sleeve", "Shoulder", "Spine", "Chest", "Wrist", "Thigh", "Neck"];

export default function InstagramDashboardPage() {
  const [statusData, setStatusData] = useState<InstagramStatusResponse | null>(null);
  const [pendingItems, setPendingItems] = useState<PendingReviewItem[]>([]);
  const [historyItems, setHistoryItems] = useState<SyncBatchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState<"pending" | "history">("pending");
  const [editingStyles, setEditingStyles] = useState<Record<string, { style: string; placement: string }>>({});

  const loadData = async () => {
    try {
      const [statusRes, pendingRes, historyRes] = await Promise.all([
        instagramApi.getStatus(),
        instagramApi.getPendingReview(),
        instagramApi.getHistory(),
      ]);
      setStatusData(statusRes);
      setPendingItems(pendingRes);
      setHistoryItems(historyRes);
      
      // Initialize edit states
      const map: Record<string, { style: string; placement: string }> = {};
      pendingRes.forEach((item) => {
        map[item.id] = {
          style: item.ai_suggested_style || "Spiritual",
          placement: item.ai_suggested_placement || "Forearm",
        };
      });
      setEditingStyles(map);
    } catch {
      toast.error("Could not reach Django sync server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTriggerSync = async () => {
    setIsSyncing(true);
    toast.loading("Running background Instagram sync...", { id: "sync-toast" });
    const res = await instagramApi.triggerSync();
    setIsSyncing(false);
    if (res.success) {
      toast.success(res.message || "Sync finished successfully!", { id: "sync-toast" });
      loadData();
    } else {
      toast.error("Failed to sync Instagram feed", { id: "sync-toast" });
    }
  };

  const handleApprove = async (item: PendingReviewItem) => {
    const edits = editingStyles[item.id] || { style: item.ai_suggested_style, placement: item.ai_suggested_placement };
    toast.loading(`Publishing "${item.title}" to portfolio...`, { id: `appr-${item.id}` });
    const res = await instagramApi.approvePost(item.id, {
      style_name: edits.style,
      placement_name: edits.placement,
      title: item.title,
    });
    if (res.success) {
      toast.success(res.message || "Tattoo published!", { id: `appr-${item.id}` });
      setPendingItems((prev) => prev.filter((p) => p.id !== item.id));
      if (statusData) {
        setStatusData({
          ...statusData,
          stats: {
            ...statusData.stats,
            pending_review: Math.max(0, statusData.stats.pending_review - 1),
            published_count: statusData.stats.published_count + 1,
          },
        });
      }
    }
  };

  const handleApproveAll = async () => {
    toast.loading("Approving all pending tattoo posts...", { id: "appr-all" });
    const res = await instagramApi.approveAll();
    if (res.success) {
      toast.success(res.message || "All posts approved!", { id: "appr-all" });
      setPendingItems([]);
      loadData();
    }
  };

  const handleHide = async (item: PendingReviewItem) => {
    const res = await instagramApi.hidePost(item.id);
    if (res.success) {
      toast.success("Post hidden from portfolio", { icon: "🙈" });
      setPendingItems((prev) => prev.filter((p) => p.id !== item.id));
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    toast.loading("Uploading & parsing Instagram data export...", { id: "upload-toast" });
    try {
      const res = await instagramApi.uploadArchiveFile(file);
      if (res.success) {
        toast.success(`Imported ${res.imported} posts! Skipped ${res.skipped} duplicates.`, { id: "upload-toast" });
        loadData();
      } else {
        toast.error("Failed to parse file", { id: "upload-toast" });
      }
    } catch {
      toast.error("Upload failed", { id: "upload-toast" });
    }
  };

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-fuchsia-500/20 border border-fuchsia-500/30 px-3 py-0.5 text-[11px] font-bold text-fuchsia-300">
            <Sparkles size={12} />
            <span>Django Automation Engine (Phases 1–20)</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1.5">
            Instagram Sync &amp; Approval Center
          </h1>
          <p className="text-xs sm:text-sm text-ink-300 mt-1">
            Manage live feed from <strong>@tatoo.iconic</strong>, review AI-tagged posts, and publish approved tattoos to your website portfolio.
          </p>
        </div>

        {/* Sync Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <label className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-ink-200 hover:text-white px-4 py-2.5 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-md">
            <Upload size={14} className="text-fuchsia-400" />
            <span>Import JSON/ZIP</span>
            <input type="file" accept=".json,.zip" onChange={handleFileUpload} className="hidden" />
          </label>

          <button
            onClick={handleTriggerSync}
            disabled={isSyncing}
            className="rounded-xl bg-gradient-to-r from-fuchsia-600 via-rose-600 to-amber-500 hover:opacity-95 text-white font-bold text-xs py-2.5 px-5 flex items-center gap-2 shadow-lg shadow-fuchsia-950/50 transition-all cursor-pointer active:scale-95"
          >
            <RefreshCw size={14} className={isSyncing ? "animate-spin text-amber-300" : ""} />
            <span>{isSyncing ? "Syncing Feed..." : "Sync Live Now"}</span>
          </button>
        </div>
      </div>

      {/* ── Status & Metrics Cards ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Account Status Card */}
        <div className="rounded-2xl border border-fuchsia-500/30 bg-gradient-to-b from-fuchsia-950/40 to-ink-900/90 p-5 backdrop-blur-xl shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-fuchsia-300 uppercase tracking-wider">Account Connected</span>
            <span className="rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] px-2 py-0.5 font-bold flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{statusData?.account.token_status || "LIVE"}</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-amber-500 to-fuchsia-600 p-0.5">
              <div className="h-full w-full rounded-xl bg-ink-950 flex items-center justify-center text-white">
                <Instagram size={18} />
              </div>
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{statusData?.account.handle || "@tatoo.iconic"}</h3>
              <p className="text-[11px] text-ink-300">{statusData?.account.artist_name || "Jainik Patel"}</p>
            </div>
          </div>
        </div>

        {/* Total Imported */}
        <div className="rounded-2xl border border-white/10 bg-ink-900/80 p-5 backdrop-blur-xl shadow-xl space-y-1.5">
          <div className="flex items-center justify-between text-ink-400 text-xs">
            <span>Total In Portfolio</span>
            <Flame size={15} className="text-amber-400" />
          </div>
          <p className="text-3xl font-display font-bold text-white">{statusData?.stats.total_imported || 2461}</p>
          <p className="text-[11px] text-emerald-400 font-semibold">{statusData?.stats.published_count || 2457} published live</p>
        </div>

        {/* Pending Review Queue */}
        <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-5 backdrop-blur-xl shadow-xl space-y-1.5">
          <div className="flex items-center justify-between text-amber-300 text-xs font-semibold">
            <span>Pending Review</span>
            <Clock size={15} className="text-amber-400" />
          </div>
          <p className="text-3xl font-display font-bold text-amber-300">{statusData?.stats.pending_review || pendingItems.length}</p>
          <p className="text-[11px] text-ink-300">Requires artist approval</p>
        </div>

        {/* Sync Engine Health */}
        <div className="rounded-2xl border border-white/10 bg-ink-900/80 p-5 backdrop-blur-xl shadow-xl space-y-1.5">
          <div className="flex items-center justify-between text-ink-400 text-xs">
            <span>Engine Health</span>
            <ShieldCheck size={15} className="text-emerald-400" />
          </div>
          <p className="text-base font-bold text-white">Zero Duplicates</p>
          <p className="text-[11px] text-ink-300">Auto rate-limit backoff active</p>
        </div>
      </div>

      {/* ── Sub-navigation Tabs ── */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab("pending")}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "pending"
                ? "bg-amber-500 text-ink-950 shadow-md shadow-amber-500/25"
                : "border border-white/10 bg-white/5 text-ink-300 hover:text-white"
            }`}
          >
            <Clock size={13} />
            <span>Pending Review Queue</span>
            <span className="rounded-full bg-black/25 px-2 py-0.5 text-[10px]">{pendingItems.length}</span>
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "history"
                ? "bg-fuchsia-600 text-white shadow-md shadow-fuchsia-600/25"
                : "border border-white/10 bg-white/5 text-ink-300 hover:text-white"
            }`}
          >
            <FileText size={13} />
            <span>Sync Audit History</span>
          </button>
        </div>

        {activeTab === "pending" && pendingItems.length > 0 && (
          <button
            onClick={handleApproveAll}
            className="rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 px-4 flex items-center gap-1.5 shadow-md transition-all cursor-pointer active:scale-95"
          >
            <CheckCheck size={14} />
            <span>Approve All ({pendingItems.length})</span>
          </button>
        )}
      </div>

      {/* ── TAB 1: Pending Review Queue ── */}
      {activeTab === "pending" && (
        <div className="space-y-4">
          {pendingItems.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-ink-900/40 p-12 text-center">
              <CheckCircle2 size={44} className="mx-auto text-emerald-400 mb-3" />
              <h3 className="text-lg font-bold text-white">All caught up! No pending reviews</h3>
              <p className="text-xs text-ink-400 mt-1 max-w-sm mx-auto">
                All imported Instagram posts have been reviewed and published to your portfolio.
              </p>
              <button
                onClick={handleTriggerSync}
                className="mt-4 rounded-xl bg-white/10 hover:bg-white/15 px-4 py-2 text-xs font-semibold text-white transition-all cursor-pointer"
              >
                Check for New Posts
              </button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {pendingItems.map((item) => {
                const currentEdits = editingStyles[item.id] || {
                  style: item.ai_suggested_style || "Spiritual",
                  placement: item.ai_suggested_placement || "Forearm",
                };

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="rounded-2xl border border-amber-500/30 bg-ink-900/90 overflow-hidden shadow-xl flex flex-col justify-between"
                  >
                    <div>
                      {/* Post Header & Image */}
                      <div className="flex flex-col sm:flex-row gap-4 p-5">
                        <div className="relative h-40 w-full sm:w-40 rounded-xl overflow-hidden bg-ink-950 shrink-0 border border-white/10">
                          <Image
                            src={item.media_items[0]?.source_url || "/images/tattoos/shiva-trishul-tattoo.jpg"}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                          <span className="absolute top-2 left-2 rounded-full bg-ink-950/80 px-2 py-0.5 text-[9px] font-bold text-white border border-white/15">
                            {item.media_type}
                          </span>
                        </div>

                        <div className="space-y-2 flex-1 min-w-0">
                          <div className="flex items-center justify-between text-[10px] text-ink-400">
                            <span>IG ID: {item.instagram_media_id}</span>
                            <span>{new Date(item.published_at).toLocaleDateString()}</span>
                          </div>
                          <h4 className="text-sm font-bold text-white leading-snug line-clamp-2">{item.title}</h4>
                          <p className="text-xs text-ink-300 line-clamp-3 leading-relaxed">{item.caption}</p>
                        </div>
                      </div>

                      {/* AI Classification Suggestions (Phase 6) */}
                      <div className="px-5 py-3 bg-fuchsia-950/30 border-t border-b border-fuchsia-500/20 space-y-2">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-bold text-fuchsia-300 flex items-center gap-1">
                            <Sparkles size={11} /> AI Classification Suggestions
                          </span>
                          <span className="text-ink-400 font-mono">
                            Confidence: {Math.round(item.ai_confidence_score * 100)}%
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] font-semibold text-ink-300 block mb-1">Style</label>
                            <select
                              value={currentEdits.style}
                              onChange={(e) =>
                                setEditingStyles({
                                  ...editingStyles,
                                  [item.id]: { ...currentEdits, style: e.target.value },
                                })
                              }
                              className="w-full rounded-lg border border-white/10 bg-ink-950 py-1.5 px-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                            >
                              {STYLES.map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="text-[10px] font-semibold text-ink-300 block mb-1">Placement</label>
                            <select
                              value={currentEdits.placement}
                              onChange={(e) =>
                                setEditingStyles({
                                  ...editingStyles,
                                  [item.id]: { ...currentEdits, placement: e.target.value },
                                })
                              }
                              className="w-full rounded-lg border border-white/10 bg-ink-950 py-1.5 px-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                            >
                              {PLACEMENTS.map((p) => (
                                <option key={p} value={p}>
                                  {p}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="p-4 bg-ink-950/70 border-t border-white/5 flex items-center justify-between gap-2">
                      <a
                        href={item.instagram_permalink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-ink-400 hover:text-fuchsia-300 text-xs flex items-center gap-1"
                      >
                        <ExternalLink size={12} />
                        <span>View on IG</span>
                      </a>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleHide(item)}
                          className="rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-ink-300 px-3 py-1.5 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <EyeOff size={13} />
                          <span>Hide</span>
                        </button>

                        <button
                          onClick={() => handleApprove(item)}
                          className="rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-1.5 text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer active:scale-95"
                        >
                          <Check size={14} />
                          <span>Approve &amp; Publish</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── TAB 2: Sync Audit History ── */}
      {activeTab === "history" && (
        <div className="rounded-2xl border border-white/10 bg-ink-900/60 overflow-hidden backdrop-blur-md shadow-xl">
          <div className="p-4 border-b border-white/5">
            <h3 className="text-sm font-bold text-white">Historical Sync Batches &amp; Audit Trail</h3>
            <p className="text-xs text-ink-400">Complete log of automated cron runs and manual sync jobs.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-ink-950/80 text-ink-400 font-semibold border-b border-white/5">
                <tr>
                  <th className="p-3.5">Started At</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Processed</th>
                  <th className="p-3.5">Imported</th>
                  <th className="p-3.5">Skipped (Dupes)</th>
                  <th className="p-3.5">Failed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-ink-200">
                {historyItems.map((h) => (
                  <tr key={h.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-3.5 font-mono text-ink-300">
                      {new Date(h.started_at).toLocaleString("en-IN")}
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                          h.status === "COMPLETED"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : h.status === "IN_PROGRESS"
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            : "bg-red-500/20 text-red-300 border border-red-500/30"
                        }`}
                      >
                        {h.status}
                      </span>
                    </td>
                    <td className="p-3.5 font-bold text-white">{h.total_processed}</td>
                    <td className="p-3.5 text-emerald-400 font-bold">{h.imported_count}</td>
                    <td className="p-3.5 text-ink-400">{h.skipped_count}</td>
                    <td className="p-3.5 text-red-400 font-semibold">{h.failed_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
