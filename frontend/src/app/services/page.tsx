import type { Metadata } from "next";
import { ServicesClient } from "@/components/pages/ServicesClient";

export const metadata: Metadata = {
  title: "Tattoo Services & Transparent Pricing (INR) | Tattoo Iconic",
  description:
    "Explore bespoke custom tattoo services by Jainik Patel: Single-needle fine line, dark realism, cover-up reworks, and luxury doorstep home service across Gujarat. Transparent pricing in Indian Rupees (₹).",
  keywords: [
    "tattoo pricing Gujarat",
    "tattoo cost Rajpipla",
    "fine line tattoo services",
    "dark realism tattoo rates",
    "home tattoo service Gujarat cost",
    "custom tattoo consultation Rajpipla",
  ],
  alternates: {
    canonical: "https://tattooiconic.in/services",
  },
};

export default function ServicesPage() {
  return <ServicesClient />;
}
