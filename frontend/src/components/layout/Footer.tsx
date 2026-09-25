import Link from "next/link";
import Image from "next/image";
import {
  Instagram,
  Mail,
  MapPin,
  Phone,
  Clock,
  ShieldCheck,
  Sparkles,
  MessageCircle,
  Home,
  CheckCircle2,
} from "lucide-react";
import { ARTIST_PROFILE } from "@/constants";

const FOOTER_SECTIONS = [
  {
    title: "Explore",
    links: [
      { href: "/portfolio", label: "Tattoo Portfolio" },
      { href: "/styles", label: "Tattoo Styles Guide" },
      { href: "/services", label: "Services & Rates" },
      { href: "/about", label: "About Jainik Patel" },
      { href: "/reviews", label: "Client Reviews" },
    ],
  },
  {
    title: "Studio & Experience",
    links: [
      { href: "/aftercare", label: "Aftercare Guide" },
      { href: "/booking", label: "Online Consultation" },
      { href: "/contact", label: "Bhadam Studio Location" },
      { href: "/flash", label: "Flash Designs" },
    ],
  },
  {
    title: "Direct Connect",
    links: [
      {
        href: `https://wa.me/${ARTIST_PROFILE.whatsapp_number.replace(/\+/g, "")}`,
        label: "WhatsApp Booking",
        external: true,
      },
      {
        href: `https://instagram.com/${ARTIST_PROFILE.instagram_handle}`,
        label: "Instagram Gallery",
        external: true,
      },
      { href: `tel:${ARTIST_PROFILE.phone.replace(/\s+/g, "")}`, label: "Direct Call" },
      { href: "/artist-access", label: "Artist Access" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink-950 text-ink-300 relative overflow-hidden">
      {/* Ambient gold glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-40 w-3/4 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

      <div className="container-page py-16 sm:py-20 relative z-10">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Brand & Artist Statement */}
          <div className="lg:col-span-4 space-y-5">
            <div className="flex items-center gap-3.5">
              <div className="relative flex h-14 w-14 items-center justify-center shrink-0 rounded-full shadow-2xl overflow-hidden">
                <Image
                  src="/images/tattoo-iconic-logo.png"
                  alt="Tattoo Iconic — Master Tattoo Studio Logo"
                  width={56}
                  height={56}
                  className="h-full w-full object-cover rounded-full"
                />
              </div>
              <div>
                <p className="font-display text-2xl text-white tracking-tight">
                  Tattoo<span className="text-amber-300 ml-1">Iconic</span>
                </p>
                <p className="text-xs text-amber-200/80 font-sans tracking-wide">
                  Jainik Patel · Master Tattoo Studio
                </p>
              </div>
            </div>

            <p className="text-sm text-ink-300 leading-relaxed max-w-sm">
              Bespoke custom tattooing crafted with surgical fine-line precision and dark realism. Private studio sessions at Bhadam, Rajpipla, Narmada and luxury mobile home service across the region.
            </p>

            {/* Quick Guarantees */}
            <div className="flex flex-wrap gap-3 text-xs text-ink-400 pt-2">
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5">
                <ShieldCheck size={14} className="text-emerald-400" /> Hospital-Grade Sterility
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5">
                <Home size={14} className="text-amber-300" /> Home Service Available
              </span>
            </div>
          </div>

          {/* Nav Columns */}
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title} className="lg:col-span-2 space-y-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-white">
                {section.title}
              </p>
              <ul className="space-y-2.5 text-sm">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-ink-400 hover:text-white transition-colors duration-200 block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Direct Channels & Studio Hours */}
          <div className="lg:col-span-2 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-white">
              Connect &amp; Book
            </p>
            <ul className="space-y-3 text-sm text-ink-300">
              <li className="flex items-start gap-2">
                <MapPin size={15} className="mt-0.5 shrink-0 text-amber-400" />
                <span className="text-xs text-ink-300">
                  At-Post Bhadam, Taluka- Rajpipla<br />
                  District- Narmada, Gujarat<br />
                  <span className="text-[11px] text-ink-400">(Studio &amp; Mobile Home Service)</span>
                </span>
              </li>
              <li className="flex items-center gap-2 pt-1">
                <Phone size={15} className="shrink-0 text-amber-400" />
                <a href={`tel:${ARTIST_PROFILE.phone.replace(/\s+/g, "")}`} className="text-xs text-white hover:text-amber-300 transition-colors font-medium">
                  {ARTIST_PROFILE.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={15} className="shrink-0 text-amber-400" />
                <a href={`mailto:${ARTIST_PROFILE.email}`} className="text-xs text-ink-300 hover:text-white transition-colors truncate">
                  {ARTIST_PROFILE.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Privacy Note & Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-500">
          <p>
            © {new Date().getFullYear()} Tattoo Iconic · Jainik Patel. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-amber-300 transition-colors">
              Privacy Policy
            </Link>
            <span>·</span>
            <Link href="/enquire" className="hover:text-amber-300 transition-colors">
              Online Enquiry
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
