import type { Metadata } from "next";
import { AboutClient } from "@/components/pages/AboutClient";

export const metadata: Metadata = {
  title: "About Master Tattoo Artist Jainik Patel | Tattoo Iconic",
  description:
    "Learn about Jainik Patel, solo master tattoo artist with 10+ years experience and 7,000+ tattoos completed. Private studio in Bhadam, Rajpipla & luxury home tattoo services in Gujarat.",
  keywords: [
    "Jainik Patel tattoo artist",
    "About Tattoo Iconic",
    "Tattoo artist Rajpipla",
    "Gujarat master tattooist",
    "Fine line tattoo specialist Gujarat",
    "Sterile tattoo studio Bhadam",
  ],
  alternates: {
    canonical: "https://tattooiconic.in/about",
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
