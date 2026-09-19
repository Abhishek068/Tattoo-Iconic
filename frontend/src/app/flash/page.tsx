import type { Metadata } from "next";
import { FlashClient } from "@/components/pages/FlashClient";

export const metadata: Metadata = {
  title: "Flash Tattoo Designs | Tattoo Iconic",
  description:
    "Explore exclusive pre-drawn flash tattoo designs by Jainik Patel ready for same-week booking. Single-needle, sacred geometry, minimalist motifs.",
  keywords: [
    "flash tattoo designs Gujarat",
    "ready to ink tattoo designs",
    "minimalist flash tattoos",
    "spiritual flash art Rajpipla",
  ],
  alternates: {
    canonical: "https://tattooiconic.in/flash",
  },
};

export default function FlashPage() {
  return <FlashClient />;
}
