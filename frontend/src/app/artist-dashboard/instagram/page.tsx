"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Instagram,
  RefreshCw,
  CheckCircle2,
  Clock,
  Sparkles,
  Eye,
  EyeOff,
  Check,
  ExternalLink,
  ShieldCheck,
  Flame,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import {
  instagramApi,
  type InstagramStatusResponse,
  type PendingReviewItem,
  type SyncBatchHistoryItem,
} from "@/services/instagramApi";
import toast from "react-hot-toast";

const STYLES = ["Spiritual", "Realism", "Fine Line", "Geometric", "Script", "Blackwork", "Traditional", "Custom"];
const PLACEMENTS = ["Forearm", "Bicep", "Full Sleeve", "Shoulder", "Spine", "Chest", "Wrist", "Thigh"];

export default function ArtistInstagramDashboardPage() {
  const [statusData, setStatusData] = useState<InstagramStatusResponse | null>(null);
  const [pendingItems, setPendingItems] = useState<PendingReviewItem[]>([]);
  const [historyItems, setHistoryItems] = useState<SyncBatchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState<"pending" | "history">("pending");

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
    } catch {
      toast.error("Error loading Instagram hub data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  async function handleTriggerSync() {
    setIsSyncing(true);
    try {
      const res = await instagramApi.triggerSync(false);
      toast.success(res.message || "Instagram sync simulation completed!");
      await loadData();
    } catch {
      toast.error("Sync error");
    } finally {
      setIsSyncing(false);
    }
  }

  async function handleApprove(itemId: string) {
    await instagramApi.approvePost(itemId);
    toast.success("Post approved and added to public portfolio!");
    loadData();
  }

  async function handleApproveAll() {
    await instagramApi.approveAll();
    toast.success("All pending posts approved!");
    loadData();
  }

  async function handleHide(itemId: string) {
    await instagramApi.hidePost(itemId);
    toast.success("Post hidden from portfolio queue.");
    loadData();
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl text-white font-bold tracking-wide">
            Instagram Feed &amp; Ingestion Hub
          </h2>
          <p className="text-xs sm:text-sm text-[#8e90a0] mt-1">
            Curate and import authentic media from <strong className="text-amber-300 font-semibold">@tatoo.iconic</strong> directly into your portfolio.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleTriggerSync}
            disabled={isSyncing}
            className="rounded-xl bg-gradient-to-r from-[#c5a059] to-[#d8b467] px-5 py-2.5 font-serif font-bold text-xs text-[#0a0a0a] tracking-wider uppercase shadow-lg shadow-amber-500/20 hover:brightness-110 transition-all inline-flex items-center gap-2 shrink-0 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={14} className={isSyncing ? "animate-spin" : ""} />
            <span>{isSyncing ? "SYNCING FEED..." : "SYNC NOW"}</span>
          </button>
        </div>
      </div>

      {/* Account Status Card */}
      {statusData && (
        <div className="rounded-2xl border border-white/10 bg-[#0d0f14]/80 backdrop-blur-xl p-6 grid md:grid-cols-4 gap-6 items-center">
          <div className="flex items-center gap-3.5">
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-pink-400">
              <Instagram size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-base font-bold text-white">
                  {statusData.account.handle}
                </h3>
                <span className="rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 text-[9px] font-bold">
                  {statusData.account.token_status}
                </span>
              </div>
              <p className="text-xs text-[#8e90a0]">
                {statusData.account.artist_name} · {statusData.account.account_type}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-white/5 bg-[#12141c] p-3 text-xs">
            <span className="text-[10px] text-[#525463] uppercase font-bold block">Total Imported</span>
            <strong className="font-serif text-lg text-white">{statusData.stats.total_imported}</strong>
            <p className="text-[10px] text-emerald-400 font-medium">2,459 Published Works</p>
          </div>

          <div className="rounded-xl border border-white/5 bg-[#12141c] p-3 text-xs">
            <span className="text-[10px] text-[#525463] uppercase font-bold block">Pending Curation</span>
            <strong className="font-serif text-lg text-amber-300">{statusData.stats.pending_review}</strong>
            <p className="text-[10px] text-[#8e90a0]">Awaiting studio review</p>
          </div>

          <div className="rounded-xl border border-white/5 bg-[#12141c] p-3 text-xs">
            <span className="text-[10px] text-[#525463] uppercase font-bold block">Last Sync Status</span>
            <strong className="font-serif text-sm text-emerald-300 block truncate">
              {statusData.stats.last_sync_status}
            </strong>
            <p className="text-[10px] text-[#8e90a0] truncate">
              {new Date(statusData.stats.last_sync_at || Date.now()).toLocaleTimeString()}
            </p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("pending")}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === "pending"
                ? "bg-[#c5a059] text-black font-bold"
                : "text-[#8e90a0] hover:text-white"
            }`}
          >
            Pending Review Queue ({pendingItems.length})
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === "history"
                ? "bg-[#c5a059] text-black font-bold"
                : "text-[#8e90a0] hover:text-white"
            }`}
          >
            Sync Batch History
          </button>
        </div>

        {activeTab === "pending" && pendingItems.length > 0 && (
          <button
            onClick={handleApproveAll}
            className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3.5 py-1.5 text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Check size={14} /> APPROVE ALL
          </button>
        )}
      </div>

      {/* Tab 1: Pending Review Queue */}
      {activeTab === "pending" && (
        <div className="space-y-4">
          {pendingItems.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-[#0d0f14]/80 p-12 text-center text-xs text-[#8e90a0] space-y-2">
              <CheckCircle2 size={28} className="mx-auto text-emerald-400" />
              <p className="font-semibold text-white">All caught up!</p>
              <p>No new Instagram posts waiting for review. Click &ldquo;SYNC NOW&rdquo; to check for new uploads.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {pendingItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-white/10 bg-[#0d0f14]/80 backdrop-blur-xl p-5 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex gap-4">
                      {/* Image Thumbnail */}
                      <div className="relative h-28 w-28 shrink-0 rounded-xl overflow-hidden border border-white/10 bg-[#12141c]">
                        <Image
                          src={item.media_items[0]?.storage_url || "/images/tattoos/shiva-trishul-tattoo.jpg"}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="space-y-1.5 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="rounded-md bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 text-[9px] font-bold text-amber-300">
                            AI Confidence {(item.ai_confidence_score * 100).toFixed(0)}%
                          </span>
                          <span className="text-[10px] text-[#747688] font-mono">
                            {item.like_count} likes
                          </span>
                        </div>

                        <h4 className="font-serif text-sm font-bold text-white line-clamp-1">
                          {item.title}
                        </h4>

                        <p className="text-xs text-[#8e90a0] line-clamp-2 leading-relaxed">
                          {item.caption}
                        </p>
                      </div>
                    </div>

                    {/* AI Suggested Tags */}
                    <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-white/5">
                      <div className="rounded-lg bg-white/5 p-2">
                        <span className="text-[9px] text-[#525463] uppercase block font-bold">Suggested Style</span>
                        <strong className="text-amber-300">{item.ai_suggested_style}</strong>
                      </div>
                      <div className="rounded-lg bg-white/5 p-2">
                        <span className="text-[9px] text-[#525463] uppercase block font-bold">Suggested Placement</span>
                        <strong className="text-white">{item.ai_suggested_placement}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleHide(item.id)}
                      className="rounded-xl border border-white/10 px-3 py-1.5 text-xs text-[#8e90a0] hover:text-white transition-colors"
                    >
                      HIDE
                    </button>

                    <button
                      onClick={() => handleApprove(item.id)}
                      className="rounded-xl bg-gradient-to-r from-[#c5a059] to-[#d8b467] px-5 py-1.5 text-xs font-bold text-[#0a0a0a] uppercase tracking-wider hover:brightness-110 transition-all flex items-center gap-1.5"
                    >
                      <Check size={13} /> APPROVE
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Sync Batch History */}
      {activeTab === "history" && (
        <div className="rounded-2xl border border-white/10 bg-[#0d0f14]/80 backdrop-blur-xl p-6 space-y-4">
          <h3 className="font-serif text-base font-bold text-white">Recent Sync Logs</h3>
          <div className="divide-y divide-white/5 text-xs">
            {historyItems.map((batch) => (
              <div key={batch.id} className="py-3 flex items-center justify-between">
                <div>
                  <strong className="text-white font-mono text-xs">{batch.id}</strong>
                  <p className="text-[11px] text-[#8e90a0]">
                    Processed {batch.total_processed} items ({batch.imported_count} imported, {batch.skipped_count} skipped)
                  </p>
                </div>
                <div className="text-right">
                  <span className="rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold">
                    {batch.status}
                  </span>
                  <p className="text-[10px] text-[#747688] pt-1">
                    {new Date(batch.started_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
