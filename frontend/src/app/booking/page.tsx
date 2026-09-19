import type { Metadata } from "next";
import { BookingClient } from "@/components/pages/BookingClient";

export const metadata: Metadata = {
  title: "Book Tattoo Consultation & Home Service | Tattoo Iconic",
  description:
    "Schedule your private custom tattoo session with Master Artist Jainik Patel in Bhadam, Rajpipla or request luxury doorstep mobile tattoo service across Gujarat. Easy online scheduling.",
  keywords: [
    "book tattoo appointment Gujarat",
    "tattoo artist Rajpipla booking",
    "home tattoo service booking Gujarat",
    "Jainik Patel tattoo consultation",
    "custom tattoo booking online",
  ],
  alternates: {
    canonical: "https://tattooiconic.in/booking",
  },
};

export default function BookingPage() {
  return <BookingClient />;
}
