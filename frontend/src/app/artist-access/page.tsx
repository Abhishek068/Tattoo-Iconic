"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  AlertCircle,
  KeyRound,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { artistAuthService } from "@/services/artist-auth.service";

export default function ArtistAccessPage() {
  const router = useRouter();
  const [securityKey, setSecurityKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!securityKey.trim()) {
      setErrorMessage("Please enter your private security key.");
      return;
    }

    setErrorMessage("");
    setIsLoading(true);

    try {
      const result = await artistAuthService.loginWithSecurityKey(securityKey.trim());

      if (result.success) {
        setIsSuccess(true);
        setTimeout(() => {
          router.push(result.redirect || "/artist-dashboard");
          router.refresh();
        }, 600);
      } else {
        setErrorMessage(result.message || "Invalid access key.");
      }
    } catch {
      setErrorMessage("Unable to verify security key. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen w-full bg-[#07080a] text-ink-100 flex flex-col justify-between overflow-hidden select-none">
      {/* ── Background Subtle Glow & Vignette ── */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(197,160,89,0.12),rgba(7,8,10,0.95))]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* ── Top Bar ── */}
      <header className="relative z-10 w-full px-6 py-6 sm:px-12 flex items-center justify-between">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-[#a3a4b2] hover:text-white transition-colors"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          <span className="uppercase">Return to Public Site</span>
        </Link>

        <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[11px] text-[#a3a4b2]">
          <Lock size={12} className="text-amber-400" />
          <span className="font-mono">Authenticated Atelier Console</span>
        </div>
      </header>

      {/* ── Center Portal Card ── */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          {/* Main Card Container */}
          <div className="rounded-2xl border border-white/10 bg-[#0d0f14]/90 backdrop-blur-2xl p-7 sm:p-9 shadow-2xl shadow-black/80 space-y-7 relative overflow-hidden">
            {/* Top Gold Border Accent */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />

            {/* Emblem & Header */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-full border border-amber-500/40 bg-[#141720] shadow-inner mb-1">
                <KeyRound size={24} className="text-amber-300" />
              </div>

              <div>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-[0.18em] text-[#f5f0eb] uppercase">
                  ARTIST ACCESS
                </h1>
                <p className="text-xs text-[#8e90a0] font-sans tracking-wide mt-1">
                  Private Studio Atelier &amp; Operations Console
                </p>
              </div>
            </div>

            {/* Error Message Display */}
            <AnimatePresence>
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 flex items-start gap-3 text-xs text-red-300"
                >
                  <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">{errorMessage}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success Animation */}
            <AnimatePresence>
              {isSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 flex items-center justify-center gap-2 text-xs text-emerald-300 font-semibold"
                >
                  <CheckCircle2 size={16} className="text-emerald-400" />
                  <span>Access Key Verified. Opening Atelier...</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Access Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label
                  htmlFor="securityKey"
                  className="block text-xs font-semibold tracking-wider uppercase text-[#cacad3]"
                >
                  Security Key
                </label>

                <div className="relative">
                  <input
                    id="securityKey"
                    name="securityKey"
                    type={showKey ? "text" : "password"}
                    value={securityKey}
                    onChange={(e) => {
                      setSecurityKey(e.target.value);
                      if (errorMessage) setErrorMessage("");
                    }}
                    placeholder="Enter private security key"
                    autoComplete="current-password"
                    disabled={isLoading || isSuccess}
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3.5 pr-11 text-sm text-white placeholder:text-[#525463] focus:border-amber-400/80 focus:bg-[#12141c] focus:outline-none focus:ring-1 focus:ring-amber-400/80 transition-all font-mono tracking-wider"
                  />

                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#747688] hover:text-white transition-colors p-1"
                    tabIndex={-1}
                    aria-label={showKey ? "Hide security key" : "Show security key"}
                  >
                    {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || isSuccess}
                className="w-full relative group overflow-hidden rounded-xl bg-gradient-to-r from-[#c5a059] via-[#d8b467] to-[#c5a059] py-3.5 px-6 font-serif font-bold text-xs tracking-[0.2em] text-[#0A0A0A] uppercase shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full border-2 border-black/80 border-t-transparent animate-spin" />
                    <span>AUTHENTICATING...</span>
                  </span>
                ) : (
                  <>
                    <span>ACCESS DASHBOARD</span>
                    <ArrowRight
                      size={15}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </>
                )}
              </button>
            </form>

            {/* Privacy & Protocol Footer */}
            <div className="pt-2 border-t border-white/5 text-center">
              <p className="text-[11px] text-[#747688] flex items-center justify-center gap-1.5 font-medium">
                <ShieldCheck size={13} className="text-emerald-400" />
                <span>Private Single-Key Authenticated Atelier Entry</span>
              </p>
            </div>
          </div>
        </motion.div>
      </main>

      {/* ── Bottom Info ── */}
      <footer className="relative z-10 w-full py-6 text-center text-xs text-[#525463]">
        <p>© {new Date().getFullYear()} Tattoo Iconic · Jainik Patel Studio Operations</p>
      </footer>
    </div>
  );
}
