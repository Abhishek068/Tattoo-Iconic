"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  X,
  Trash2,
  MessageCircle,
  ArrowRight,
  Sparkles,
  Share2,
} from "lucide-react";
import type { MoodboardItem } from "@/types";
import { ARTIST_PROFILE } from "@/constants";
import toast from "react-hot-toast";

interface Props {
  items: MoodboardItem[];
  onRemove: (itemId: string) => void;
  onClear: () => void;
}

export function MoodboardDrawer({ items, onRemove, onClear }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || items.length === 0) return null;

  const handleWhatsAppConsult = () => {
    const listText = items
      .map((item, idx) => `${idx + 1}. ${item.title} (${item.style} / ${item.placement})`)
      .join("%0A");

    const message = `Hello%20Jainik%20bhai,%20I%20created%20a%20tattoo%20moodboard%20on%20your%20website%20with%20${items.length}%20designs:%0A%0A${listText}%0A%0AI%20would%20like%20to%20consult%20for%20a%20custom%20session!`;

    window.open(
      `https://wa.me/${ARTIST_PROFILE.whatsapp_number.replace(/[^0-9]/g, "")}?text=${message}`,
      "_blank"
    );
  };

  return (
    <>
      {/* ── Sticky Bottom Floating Bar ── */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-6 inset-x-4 sm:inset-x-auto sm:right-6 z-40 max-w-md mx-auto"
      >
        <div className="rounded-2xl border border-red-500/40 bg-ink-950/95 p-3.5 sm:p-4 backdrop-blur-2xl shadow-2xl shadow-black flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setIsOpen(true)}>
            <div className="relative h-10 w-10 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
              <Heart size={20} className="fill-red-500 text-red-500 animate-pulse" />
              <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-red-500 text-white font-bold text-[10px] flex items-center justify-center border-2 border-ink-950">
                {items.length}
              </span>
            </div>

            <div>
              <p className="text-xs font-bold text-white">Your Tattoo Moodboard</p>
              <p className="text-[11px] text-ink-300">
                {items.length} design{items.length > 1 ? "s" : ""} saved · Click to view
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsOpen(true)}
              className="rounded-xl bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white border border-red-500/30 px-3 py-2 text-xs font-bold transition-all cursor-pointer"
            >
              View Board
            </button>

            <button
              onClick={handleWhatsAppConsult}
              className="rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
              title="Send all saved ideas to Jainik via WhatsApp"
            >
              <MessageCircle size={14} />
              <span className="hidden sm:inline">Consult</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* ── Full Moodboard Modal / Drawer ── */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl max-h-[90vh] rounded-3xl border border-red-500/30 bg-ink-950 shadow-2xl p-6 sm:p-8 flex flex-col justify-between overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
                    <Heart size={18} className="fill-red-500 text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl sm:text-2xl text-white font-bold">
                      My Tattoo Moodboard
                    </h3>
                    <p className="text-xs text-ink-300">
                      {items.length} saved reference{items.length > 1 ? "s" : ""} for your session with Jainik Patel
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (confirm("Clear all items from your moodboard?")) {
                        onClear();
                        setIsOpen(false);
                      }
                    }}
                    className="text-xs text-ink-400 hover:text-red-400 px-2 py-1 transition-colors"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="h-8 w-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-ink-300 hover:text-white"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Items Grid */}
              <div className="my-6 overflow-y-auto max-h-[50vh] pr-2 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="relative rounded-2xl border border-white/10 bg-ink-900/80 p-2.5 flex flex-col justify-between group overflow-hidden"
                  >
                    <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-ink-950">
                      <Image src={item.image} alt={item.title} fill className="object-cover" />
                      <button
                        onClick={() => onRemove(item.item_id)}
                        className="absolute top-2 right-2 h-7 w-7 rounded-full bg-black/80 text-white hover:bg-red-500 flex items-center justify-center transition-colors"
                        title="Remove from moodboard"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>

                    <div className="mt-2.5 space-y-1">
                      <p className="text-xs font-bold text-white truncate">{item.title}</p>
                      <p className="text-[10px] text-ink-400">
                        {item.style} · {item.placement}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Consultation Footer */}
              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-xs text-ink-300 text-center sm:text-left">
                  Share these references with Jainik for a direct concept &amp; quote consultation.
                </p>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={handleWhatsAppConsult}
                    className="flex-1 sm:flex-none rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3 px-5 flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
                  >
                    <MessageCircle size={16} />
                    <span>Send Moodboard to WhatsApp</span>
                  </button>

                  <Link
                    href="/booking"
                    onClick={() => setIsOpen(false)}
                    className="btn-primary text-xs py-3 px-5 text-center font-bold"
                  >
                    Proceed to Booking Form &rarr;
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
