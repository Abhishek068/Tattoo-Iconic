"use client";

import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle2,
  Info,
  ArrowRight,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SERVICES_CATALOG, ARTIST_PROFILE } from "@/constants";

export function ServicesClient() {
  return (
    <>
      <Navbar />

      <main className="container-hero py-12 sm:py-16 space-y-20">
        {/* Header */}
        <div className="max-w-3xl">
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white font-bold leading-tight">
            Services &amp; Pricing Guide
          </h1>
          <p className="text-base sm:text-lg text-ink-300 mt-3 leading-relaxed">
            Every session with Jainik Patel is tailored to your unique anatomical goals. Explore our studio sessions, luxury home services, and custom consultations.
          </p>
        </div>

        {/* Pricing Factors Disclaimer Box */}
        <div className="glass-card p-6 sm:p-8 border-amber-500/30 bg-gradient-to-r from-ink-950 via-surface-card to-ink-950">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40">
              <Info size={20} />
            </div>
            <div className="space-y-2">
              <h3 className="font-display text-lg text-white font-bold">
                How Tattoo Pricing is Structured
              </h3>
              <p className="text-xs sm:text-sm text-ink-300 leading-relaxed">
                Tattooing is a personalized artistic procedure. Final quotes are calculated based on:
              </p>
              <div className="grid sm:grid-cols-3 gap-2 pt-2 text-xs text-ink-300">
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                  <span>Size &amp; Scale of Artwork</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                  <span>Design Complexity &amp; Texture</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                  <span>Anatomical Body Placement</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                  <span>Estimated Needle Time</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                  <span>Travel Distance (Home Service)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                  <span>Cover-up / Scar Camouflage</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Services Catalog */}
        <div className="space-y-16">
          {SERVICES_CATALOG.map((service) => (
            <div
              key={service.id}
              id={service.slug}
              className="glass-card p-8 sm:p-10 border-white/15 grid lg:grid-cols-12 gap-8 items-start"
            >
              {/* Left Column: Visual & Quick Meta */}
              <div className="lg:col-span-5 space-y-4">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-ink-950 border border-white/10">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="rounded-full bg-ink-950/80 backdrop-blur-md px-3 py-1 text-xs font-semibold text-amber-200 border border-white/10">
                      {service.service_type === "home" ? "Mobile Home Visit" : "Studio Inking"}
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-ink-400">Estimated Duration</span>
                    <span className="font-semibold text-white">{service.estimated_duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-400">Pricing Model</span>
                    <span className="font-semibold text-amber-300">
                      {service.starting_price
                        ? `From ₹${service.starting_price.toLocaleString("en-IN")}`
                        : service.price_model}
                    </span>
                  </div>
                  {service.hourly_rate && (
                    <div className="flex justify-between">
                      <span className="text-ink-400">Studio Hourly Rate</span>
                      <span className="font-semibold text-white">₹{service.hourly_rate.toLocaleString("en-IN")} / hr</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Descriptions, Suitable For & Steps */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <h2 className="font-display text-3xl text-white font-bold">
                    {service.title}
                  </h2>
                  <p className="text-sm text-ink-300 mt-2 leading-relaxed">
                    {service.full_desc}
                  </p>
                </div>

                {/* Suitable For */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">
                    Suitable For
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {service.suitable_for.map((item) => (
                      <span
                        key={item}
                        className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs text-ink-200"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Process Steps */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">
                    Step-by-Step Procedure
                  </p>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {service.process_steps.map((step, i) => (
                      <div
                        key={step}
                        className="flex items-center gap-2 rounded-xl border border-white/5 bg-ink-950/60 p-3 text-xs text-ink-200"
                      >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand/30 text-[10px] font-bold text-white">
                          0{i + 1}
                        </span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Features */}
                <ul className="space-y-1.5 text-xs text-ink-300 pt-1">
                  {service.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                {/* Book Action */}
                <div className="pt-3 border-t border-white/10 flex flex-wrap items-center gap-4">
                  <Link
                    href={`/booking?service=${service.slug}`}
                    className="btn-primary text-xs sm:text-sm py-3 px-6"
                  >
                    <span>Request {service.title}</span>
                    <ArrowRight size={14} className="ml-1.5" />
                  </Link>

                  <a
                    href={`https://wa.me/${ARTIST_PROFILE.whatsapp_number.replace(/\+/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary text-xs sm:text-sm py-3 px-4 text-emerald-400"
                  >
                    Ask on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </>
  );
}
