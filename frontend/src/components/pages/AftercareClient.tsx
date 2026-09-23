"use client";

import { Droplets, Sun, Ban, ShieldCheck, Clock, AlertTriangle, Phone, Mail, Sparkles } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ARTIST_PROFILE } from "@/constants";

const PHASES = [
  {
    title: "Day 1–3: Fresh Tattoo",
    icon: Clock,
    iconColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    badge: "Immediate Care",
    badgeColor: "text-amber-300 bg-amber-500/10 border-amber-500/30",
    items: [
      "Keep the protective bandage or second-skin wrap on for 2–4 hours (or as instructed by Jainik)",
      "Wash gently with lukewarm water and fragrance-free antibacterial soap",
      "Pat completely dry with a clean, single-use paper towel — never rub or use regular bath towels",
      "Apply a very thin, breathable layer of recommended aftercare balm (Hustle Butter or Aquaphor)",
      "Wash and moisturize 2–3 times a day with clean hands",
    ],
  },
  {
    title: "Day 4–14: Peeling & Flaking Phase",
    icon: Droplets,
    iconColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    badge: "Active Healing",
    badgeColor: "text-blue-300 bg-blue-500/10 border-blue-500/30",
    items: [
      "Your tattoo will start to peel and flake like a sunburn — this is completely normal",
      "Do NOT pick, scratch, peel, or scrub the flaking skin under any circumstance",
      "Continue washing gently twice daily and keeping the skin lightly hydrated",
      "Switch to a lighter, unscented water-based lotion if the area feels overly tight",
      "Wear loose, breathable 100% cotton clothing over the tattooed area",
    ],
  },
  {
    title: "Week 3–6: Settling & Deeper Healing",
    icon: ShieldCheck,
    iconColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    badge: "Skin Recovery",
    badgeColor: "text-emerald-300 bg-emerald-500/10 border-emerald-500/30",
    items: [
      "The tattoo may look slightly matte, milky, or cloudy as the epidermis rebuilds",
      "Continue moisturizing once or twice daily to nourish the fresh skin cells",
      "Avoid direct harsh sun exposure or tanning beds while deeper layers heal",
      "If mild itching occurs, gently pat the area or apply moisturizer — never scratch",
    ],
  },
  {
    title: "Long-Term Brilliance & Care",
    icon: Sun,
    iconColor: "text-amber-300 bg-amber-500/10 border-amber-500/20",
    badge: "Lifelong Longevity",
    badgeColor: "text-amber-300 bg-amber-500/10 border-amber-500/30",
    items: [
      "Always apply broad-spectrum SPF 50+ sunscreen over healed tattoos when outdoors",
      "Keep skin moisturized to maintain sharp contrast and crisp line definition",
      "Complimentary touch-up assessment is available — contact Jainik if any line needs a tune-up",
      "Stay hydrated and maintain healthy skin for vibrant lifelong artwork",
    ],
  },
];

const DONTS = [
  "Submerge in water (baths, swimming pools, hot tubs, ocean/sea) for at least 3 weeks",
  "Expose fresh tattoo to direct sunlight, sunlamps, or tanning beds",
  "Apply petroleum jelly (Vaseline), heavily scented lotions, or alcohol-based sanitizers",
  "Wear tight, synthetic, or abrasive clothing that rubs against the tattooed skin",
  "Engage in heavy sweat workouts or contact sports for the first 48–72 hours",
  "Let pets lick, sleep on, or rub against the healing tattoo area",
  "Touch or handle the fresh tattoo with unwashed hands",
];

export function AftercareClient() {
  return (
    <>
      <Navbar />

      <main className="container-page pt-28 sm:pt-36 pb-20 space-y-12">
        {/* Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-300 mb-4">
            <Sparkles size={13} />
            <span>Master Inking Protocol</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
            Tattoo Aftercare Guide
          </h1>
          <p className="mt-4 text-base sm:text-lg text-ink-300 leading-relaxed">
            Proper aftercare is 50% of the final masterpiece. Follow Jainik Patel&apos;s proven step-by-step instructions to ensure rich pigment saturation, sharp lines, and effortless healing.
          </p>
        </div>

        {/* Healing Phases */}
        <div className="space-y-6">
          <h2 className="font-display text-2xl sm:text-3xl text-white font-bold">
            Step-by-Step Healing Timeline
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {PHASES.map((phase) => (
              <div key={phase.title} className="glass-card flex flex-col justify-between p-6 sm:p-7 border border-white/10 hover:border-amber-500/30 transition-all duration-300">
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-11 w-11 items-center justify-center rounded-xl border ${phase.iconColor}`}>
                        <phase.icon size={22} />
                      </div>
                      <h3 className="text-lg sm:text-xl font-display font-bold text-white">
                        {phase.title}
                      </h3>
                    </div>
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full border ${phase.badgeColor} shrink-0`}>
                      {phase.badge}
                    </span>
                  </div>

                  <ul className="mt-4 space-y-3">
                    {phase.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-ink-200 leading-relaxed">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0 shadow-sm shadow-amber-400/50" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* What To Avoid Section */}
        <div className="glass-card border-red-500/30 bg-gradient-to-br from-red-950/20 via-ink-900/90 to-ink-950 p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10 text-red-400">
              <Ban size={22} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-red-200">
                Critical Things to Avoid
              </h2>
              <p className="text-xs sm:text-sm text-ink-400">
                Protect your skin against common healing hazards
              </p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {DONTS.map((item, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl border border-red-500/15 bg-red-950/10 p-3.5 text-sm text-red-200/90 leading-relaxed">
                <Ban size={16} className="mt-0.5 shrink-0 text-red-400" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* When to contact */}
        <div className="glass-card border-amber-500/30 bg-gradient-to-br from-amber-950/20 via-ink-900/90 to-ink-950 p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-400 shrink-0">
              <AlertTriangle size={22} />
            </div>
            <div className="space-y-2">
              <h3 className="font-display text-xl font-bold text-amber-200">
                When to Reach Out to Us
              </h3>
              <p className="text-sm text-ink-300 leading-relaxed">
                Mild redness, tightness, and warm sensations are completely standard for the first 48–72 hours. If you ever experience excessive swelling, throbbing heat, abnormal discharge, or have any question about your healing progress, contact Jainik immediately for personalized guidance.
              </p>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="glass-card text-center p-8 sm:p-10 border-white/10 space-y-4 max-w-2xl mx-auto">
          <h3 className="font-display text-2xl text-white font-bold">
            Questions About Your Healing?
          </h3>
          <p className="text-sm text-ink-300">
            Jainik Patel is always available to support you through every stage of your healing journey.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <a href={`tel:${ARTIST_PROFILE.phone}`} className="btn-secondary">
              <Phone size={15} className="mr-2 text-amber-400" />
              <span>Call {ARTIST_PROFILE.phone}</span>
            </a>
            <a href={`mailto:${ARTIST_PROFILE.email}`} className="btn-gold">
              <Mail size={15} className="mr-2" />
              <span>Email {ARTIST_PROFILE.email}</span>
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
