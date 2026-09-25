import type { Metadata } from "next";
import { PortfolioClient } from "@/components/pages/PortfolioClient";

export const metadata: Metadata = {
  title: "Tattoo Portfolio & Live Works | Tattoo Iconic",
  description:
    "Browse 100+ fine line, spiritual Mahadev, Hanuman, dark realism, and custom sleeve masterworks by Jainik Patel. Filter by style and placement, or save to your personal moodboard.",
  keywords: [
    "tattoo portfolio Gujarat",
    "Mahadev tattoo design",
    "Hanuman spiritual tattoo",
    "fine line tattoo designs Rajpipla",
    "dark realism sleeve tattoo",
    "Jainik Patel portfolio",
  ],
  alternates: {
    canonical: "https://tattooiconic.in/portfolio",
  },
};

import { Suspense } from "react";
import { Spinner } from "@/components/ui";

export default function PortfolioPage() {
  return (
    <Suspense fallback={<Spinner className="min-h-screen bg-[#0A0B0E]" />}>
      <PortfolioClient />
    </Suspense>
  );
}
