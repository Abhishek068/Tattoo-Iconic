"use client";

import { usePathname } from "next/navigation";
import { MagneticElement, RollingText } from "@/components/ui/LusionEffects";
import { createWhatsAppUrl, type WhatsAppUrlOptions } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export function WhatsAppIcon({
  size = 14,
  className,
}: {
  size?: number | string;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path d="M12.004 2C6.48 2 2 6.48 2 12c0 1.82.49 3.53 1.34 5L2 22l5.22-1.3c1.43.78 3.06 1.22 4.78 1.22 5.52 0 10-4.48 10-10S17.524 2 12.004 2zm5.72 14.18c-.24.67-1.39 1.28-1.92 1.36-.51.08-1.15.12-3.32-.78-2.61-1.08-4.27-3.73-4.4-3.9-.13-.17-1.06-1.41-1.06-2.69 0-1.28.67-1.91.91-2.16.24-.25.53-.31.7-.31.18 0 .36 0 .52.01.17.01.4.06.61.53.24.58.82 2 .89 2.15.07.15.11.33.02.53-.09.2-.14.33-.28.5-.14.17-.3.38-.43.51-.15.15-.3.31-.13.6.17.29.77 1.27 1.65 2.05 1.13 1.01 2.09 1.32 2.38 1.47.3.15.47.13.64-.07.18-.2.77-.9 1-.1.21-.29.42-.25.7-.15.28.1 1.78.84 2.09.99.31.15.52.23.59.36.07.13.07.76-.17 1.43z" />
    </svg>
  );
}

export interface WhatsAppButtonProps {
  label?: string;
  message?: string;
  tattooName?: string;
  context?: WhatsAppUrlOptions["context"];
  phone?: string;
  variant?: "floating" | "inline" | "secondary";
  className?: string;
  ariaLabel?: string;
  iconSize?: number;
  magnetic?: boolean;
}

export function WhatsAppButton({
  label = "CHAT ON WHATSAPP",
  message,
  tattooName,
  context,
  phone,
  variant = "floating",
  className,
  ariaLabel = "Chat with Jainik Patel on WhatsApp",
  iconSize = 14,
  magnetic = true,
}: WhatsAppButtonProps) {
  const pathname = usePathname();

  // Automatic contextual detection if not explicitly specified
  let detectedContext = context;
  if (!detectedContext) {
    if (pathname === "/contact") {
      detectedContext = "contact";
    } else if (pathname === "/portfolio") {
      detectedContext = "portfolio";
    } else if (pathname?.startsWith("/portfolio/")) {
      detectedContext = "tattoo_detail";
    } else {
      detectedContext = "home";
    }
  }

  const href = createWhatsAppUrl({
    message,
    tattooName,
    context: detectedContext,
    phone,
  });

  const baseContent = (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={cn(
        "flex items-center gap-2 sm:gap-2.5 font-bold text-[10px] sm:text-xs tracking-[0.12em] sm:tracking-[0.18em] uppercase transition-all duration-300 group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950",
        variant === "secondary"
          ? "border border-white/15 bg-white/5 backdrop-blur-md text-ink-100 hover:bg-white/10 hover:border-white/30 hover:text-white px-4 py-2.5 sm:px-6 sm:py-3.5 rounded-none"
          : "bg-[#C5A059] text-[#0A0A0A] px-4 py-2.5 sm:px-6 sm:py-3.5 hover:bg-[#d8b467] shadow-2xl shadow-black/80 hover:scale-105 active:scale-95 rounded-full sm:rounded-none",
        className
      )}
    >
      <WhatsAppIcon
        size={iconSize}
        className="shrink-0 group-hover:rotate-12 transition-transform duration-300"
      />
      <RollingText text={label} />
    </a>
  );

  if (variant === "floating") {
    return (
      <div className="fixed bottom-5 right-4 sm:bottom-8 sm:right-8 z-40">
        {magnetic ? (
          <MagneticElement strength={0.3}>{baseContent}</MagneticElement>
        ) : (
          baseContent
        )}
      </div>
    );
  }

  if (magnetic) {
    return <MagneticElement strength={0.25}>{baseContent}</MagneticElement>;
  }

  return baseContent;
}
