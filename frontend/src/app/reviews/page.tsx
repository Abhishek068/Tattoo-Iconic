import type { Metadata } from "next";
import { ReviewsClient } from "@/components/pages/ReviewsClient";

export const metadata: Metadata = {
  title: "Client Reviews & Healed Tattoo Results | Tattoo Iconic",
  description:
    "Read 5-star verified client reviews and inspect healed tattoo results from collectors across Rajpipla, Vadodara, Surat, and Gujarat inked by Jainik Patel.",
  keywords: [
    "tattoo reviews Rajpipla",
    "Jainik Patel tattoo reviews",
    "healed tattoo photos Gujarat",
    "best rated tattoo artist Gujarat",
    "Tattoo Iconic customer testimonials",
  ],
  alternates: {
    canonical: "https://tattooiconic.in/reviews",
  },
};

export default function ReviewsPage() {
  return <ReviewsClient />;
}
