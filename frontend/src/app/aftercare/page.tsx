import type { Metadata } from "next";
import { AftercareClient } from "@/components/pages/AftercareClient";

export const metadata: Metadata = {
  title: "Complete Tattoo Aftercare & Healing Guide | Tattoo Iconic",
  description:
    "Expert tattoo healing instructions by Jainik Patel: Day 1-3 fresh care, peeling stage, long-term preservation, recommended moisturizers, and what to avoid.",
  keywords: [
    "tattoo aftercare guide",
    "tattoo healing stages",
    "how to heal a fresh tattoo",
    "tattoo care instructions Gujarat",
    "tattoo moisturizing tips",
  ],
  alternates: {
    canonical: "https://tattooiconic.in/aftercare",
  },
};

export default function AftercarePage() {
  return <AftercareClient />;
}
