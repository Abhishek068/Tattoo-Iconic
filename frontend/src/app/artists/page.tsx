import type { Metadata } from "next";
import { ArtistsClient } from "@/components/pages/ArtistsClient";

export const metadata: Metadata = {
  title: "Master Artist Profile · Jainik Patel | Tattoo Iconic",
  description:
    "Discover the craft, story, awards, and artistic background of Master Tattoo Artist Jainik Patel. 10+ years experience, fine line, and spiritual realism tattooing in Gujarat.",
  keywords: [
    "Jainik Patel tattoo artist profile",
    "master tattooist Rajpipla",
    "Tattoo Iconic founder",
    "fine line specialist Gujarat",
  ],
  alternates: {
    canonical: "https://tattooiconic.in/artists",
  },
};

export default function ArtistsPage() {
  return <ArtistsClient />;
}
