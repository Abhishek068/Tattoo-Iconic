import type { Metadata } from "next";
import { PortfolioDetailClient } from "@/components/pages/PortfolioDetailClient";

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.id;
  const formattedTitle = id
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return {
    title: `${formattedTitle} — Master Tattoo Piece | Tattoo Iconic`,
    description: `Inspect high-resolution anatomical photos, healed results, and design breakdown for ${formattedTitle} by Master Artist Jainik Patel.`,
    alternates: {
      canonical: `https://tattooiconic.in/portfolio/${id}`,
    },
  };
}

export default function PortfolioDetailPage() {
  return <PortfolioDetailClient />;
}
