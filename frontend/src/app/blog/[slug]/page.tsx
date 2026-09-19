import type { Metadata } from "next";
import { BlogDetailClient } from "@/components/pages/BlogDetailClient";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = params.slug;
  const formattedTitle = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return {
    title: `${formattedTitle} | Tattoo Iconic Blog`,
    description: `Read the latest tattoo guide, design meaning, and studio updates on ${formattedTitle} by Jainik Patel.`,
    alternates: {
      canonical: `https://tattooiconic.in/blog/${slug}`,
    },
  };
}

export default function BlogDetailPage() {
  return <BlogDetailClient />;
}
