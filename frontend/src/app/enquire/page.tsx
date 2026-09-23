import type { Metadata } from "next";
import { BookingClient } from "@/components/pages/BookingClient";

export const metadata: Metadata = {
  title: "Tattoo Enquiry & Consultation | Tattoo Iconic",
  description:
    "Submit your custom tattoo idea to Master Artist Jainik Patel. Request studio visits in Bhadam, Rajpipla or luxury home tattoo service across Gujarat.",
  keywords: [
    "tattoo enquiry Gujarat",
    "tattoo consultation Rajpipla",
    "home tattoo service enquiry",
    "Jainik Patel tattoo enquiry",
    "custom tattoo booking online",
  ],
  alternates: {
    canonical: "https://tattooiconic.in/enquire",
  },
};

export default function EnquirePage() {
  return <BookingClient />;
}
