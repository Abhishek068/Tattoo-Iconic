import type { Metadata } from "next";
import { ArtistDetailClient } from "@/components/pages/ArtistDetailClient";

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.id;
  const formattedName = id
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return {
    title: `${formattedName} · Artist Profile | Tattoo Iconic`,
    description: `View ${formattedName}'s tattoo portfolio, client ratings, specialties, and booking availability at Tattoo Iconic.`,
    alternates: {
      canonical: `https://tattooiconic.in/artists/${id}`,
    },
  };
}

export default function ArtistDetailPage() {
  return <ArtistDetailClient />;
}
