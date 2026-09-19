"use client";
import { Droplets, Sun, Ban, ShieldCheck, Clock, AlertTriangle } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const PHASES = [
  { title: "Day 1–3: Fresh Tattoo", icon: Clock, color: "text-red-500 bg-red-50", items: [
    "Keep the bandage on for 2–4 hours after your session",
    "Wash gently with lukewarm water and fragrance-free soap",
    "Pat dry with a clean paper towel — never rub",
    "Apply a thin layer of unscented moisturiser (Hustle Butter, Aquaphor, or similar)",
    "Wash and moisturise 2–3 times a day",
  ]},
  { title: "Day 4–14: Peeling Phase", icon: Droplets, color: "text-blue-500 bg-blue-50", items: [
    "Your tattoo will start to peel and flake — this is completely normal",
    "Do NOT pick, scratch, or peel the flaking skin",
    "Continue washing gently twice daily",
    "Switch to a lighter, unscented lotion if the area feels tight",
    "Wear loose, breathable clothing over the tattoo",
  ]},
  { title: "Week 3–6: Healing", icon: ShieldCheck, color: "text-green-500 bg-green-50", items: [
    "The tattoo may look slightly cloudy or dull — this is normal as the deeper layers heal",
    "Continue moisturising once or twice daily",
    "Avoid prolonged sun exposure on the healing tattoo",
    "If itching occurs, pat gently or apply moisturiser — don't scratch",
  ]},
  { title: "Long-Term Care", icon: Sun, color: "text-yellow-500 bg-yellow-50", items: [
    "Always apply SPF 30+ sunscreen over healed tattoos when outdoors",
    "Keep your skin moisturised to maintain vibrancy",
    "Touch-ups are normal — contact us if you notice any areas that need attention",
    "Stay hydrated and maintain healthy skin for the best long-term results",
  ]},
];

const DONTS = [
  "Submerge in water (baths, pools, hot tubs, sea) for at least 2 weeks",
  "Expose to direct sunlight or use tanning beds",
  "Apply scented lotions, alcohol-based products, or Vaseline",
  "Wear tight clothing that rubs against the tattoo",
  "Exercise intensely for the first 48 hours (sweat can irritate the area)",
  "Let pets sleep on or near the fresh tattoo",
  "Touch the tattoo with unwashed hands",
];

export default function AftercarePage() {
  return (
    <><Navbar />
      <main className="container-page py-12">
        <h1 className="section-heading">Aftercare Guide</h1>
        <p className="section-subheading">Proper aftercare is the difference between a good tattoo and a great one. Follow these steps for the best possible heal.</p>

        <div className="mt-12 space-y-8">
          {PHASES.map((phase) => (
            <div key={phase.title} className="card">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${phase.color}`}><phase.icon size={20} /></div>
                <h2 className="text-xl font-display">{phase.title}</h2>
              </div>
              <ul className="mt-4 space-y-2.5 ml-13">
                {phase.items.map((item, i) => <li key={i} className="flex items-start gap-2 text-sm text-ink-600"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-brand shrink-0" />{item}</li>)}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 card border-red-200 bg-red-50/30">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600"><Ban size={20} /></div>
            <h2 className="text-xl font-display text-red-900">What to avoid</h2>
          </div>
          <ul className="mt-4 space-y-2.5">
            {DONTS.map((item, i) => <li key={i} className="flex items-start gap-2 text-sm text-red-800"><Ban size={14} className="mt-0.5 shrink-0 text-red-400" />{item}</li>)}
          </ul>
        </div>

        <div className="mt-12 card bg-yellow-50/50 border-yellow-200">
          <div className="flex items-center gap-3"><AlertTriangle size={20} className="text-yellow-600" /><h3 className="font-display text-lg text-yellow-900">When to contact us</h3></div>
          <p className="mt-2 text-sm text-yellow-800">If you notice excessive redness, swelling, pus, or a rash that doesn't improve after a few days, please contact the studio or see a doctor. Some redness and warmth is normal for the first few days, but signs of infection should be addressed promptly.</p>
        </div>

        <div className="mt-12 text-center">
          <p className="text-ink-500">Questions about healing? Get in touch.</p>
          <div className="mt-4 flex justify-center gap-3">
            <a href="tel:+918238767100" className="btn-secondary">Call +91 8238767100</a>
            <a href="mailto:jainikpatel.tattoo@gmail.com" className="btn-primary">Email Jainik Patel</a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
