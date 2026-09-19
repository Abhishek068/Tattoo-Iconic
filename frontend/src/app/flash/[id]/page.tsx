import type { Metadata } from "next";
import { FlashDetailClient } from "@/components/pages/FlashDetailClient";

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
    title: `${formattedTitle} · Flash Design | Tattoo Iconic`,
    description: `Claim ${formattedTitle} pre-drawn flash tattoo design by Jainik Patel. Instant booking availability.`,
    alternates: {
      canonical: `https://tattooiconic.in/flash/${id}`,
    },
  };
}

export default function FlashDetailPage() {
  return <FlashDetailClient />;
}
