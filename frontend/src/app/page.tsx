import type { Metadata } from "next";
import { HomeClient } from "@/components/pages/HomeClient";

export const metadata: Metadata = {
  title: "Tattoo Iconic | Jainik Patel — Master Tattoo Studio & Luxury Home Service",
  description:
    "Master Tattoo Artist Jainik Patel in Bhadam, Rajpipla, Gujarat. Specializing in fine line, dark realism, sacred spiritual Mahadev/Hanuman tattoos, and luxury home service across Gujarat.",
  keywords: [
    "tattoo artist near Rajpipla",
    "best tattoo studio in Rajpipla",
    "tattoo artist Gujarat",
    "Jainik Patel tattoo artist",
    "Bhadam tattoo studio",
    "spiritual tattoo artist",
    "fine line tattoo Rajpipla",
    "dark realism tattoo Gujarat",
    "home tattoo service Gujarat",
  ],
  alternates: {
    canonical: "https://tattooiconic.in",
  },
  openGraph: {
    title: "Tattoo Iconic | Jainik Patel — Master Tattoo Artist",
    description:
      "10+ Years Mastery · 7,000+ Inked · Fine Line, Dark Realism & Sacred Spiritual Tattoos in Rajpipla, Gujarat.",
    url: "https://tattooiconic.in",
    siteName: "Tattoo Iconic",
    images: [
      {
        url: "/images/hero/slide-1-lion-crown.jpg",
        width: 1200,
        height: 630,
        alt: "Tattoo Iconic Masterpiece by Jainik Patel",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
};

export default function HomePage() {
  return <HomeClient />;
}
