import Link from "next/link";
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
      { href: "/about", label: "About Jainik Patel" },
      { href: "/services", label: "Services & Pricing" },
      { href: "/reviews", label: "Customer Reviews" },
      { href: "/contact", label: "Get in Touch" },
    ],
  },
  {
    title: "Services",
    links: [
      { href: "/services#custom-tattoos", label: "Custom Tattoo Art" },
      { href: "/services#home-service", label: "Luxury Home Service" },
      { href: "/services#small-tattoos", label: "Fine Line & Minimalist" },
      { href: "/services#large-scale-tattoos", label: "Full Sleeves & Projects" },
      { href: "/services#cover-up-tattoos", label: "Cover-ups & Reworks" },
      { href: "/services#tattoo-consultation", label: "1-on-1 Consultation" },
    ],
  },
  {
    title: "Client Care",
    links: [
      { href: "/booking", label: "Book Appointment" },
      { href: "/aftercare", label: "Medical Aftercare Protocol" },
      { href: "/contact#faqs", label: "Studio FAQs & Policies" },
      { href: "/dashboard", label: "Artist / Admin Portal" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-[#060709] text-ink-300 relative overflow-hidden">
      {/* Subtle Ambient Lighting */}
      <div className="accent-glow left-1/4 bottom-0 h-96 w-96 bg-brand/10" />
      <div className="accent-glow right-10 bottom-10 h-80 w-80 bg-gold/5" />

      <div className="container-page py-16 sm:py-20 relative z-10">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Brand & Artist Statement */}
          <div className="lg:col-span-4 space-y-5">
            <div className="flex items-center gap-3.5">
              <div className="relative flex h-14 w-14 items-center justify-center shrink-0 rounded-full shadow-2xl overflow-hidden">
                <img
                  src="/images/tattoo-iconic-logo.png?v=5"
                  alt="Tattoo Iconic Logo"
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
        <div className="mt-14 pt-8 text-center text-xs text-ink-500">
          <p>
            © {new Date().getFullYear()} Tattoo Iconic · Jainik Patel. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
