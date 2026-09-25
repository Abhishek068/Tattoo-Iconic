import { Metadata } from "next";
import { StylesClient } from "@/components/pages/StylesClient";

export const metadata: Metadata = {
  title: "Tattoo Styles & Artistry Guide | Tattoo Iconic — Jainik Patel",
  description:
    "Explore 13 master tattoo styles by Jainik Patel at Tattoo Iconic. Sacred spiritual Vedic art, fine line, micro-realism, Japanese Irezumi, dark realism, dotwork mandalas, calligraphy & custom cover-ups in Rajpipla, Gujarat.",
  keywords: [
    "Tattoo styles Gujarat",
    "Spiritual tattoo artist",
    "Fine line tattoo Rajpipla",
    "Dark realism tattoo India",
    "Japanese Irezumi tattoo",
    "Micro realism tattoo",
    "Sanskrit mantra tattoo calligraphy",
    "Lord Shiva Trishul tattoo",
    "Hanuman tattoo artist",
    "Tattoo Iconic styles",
    "Jainik Patel tattoo artist",
  ],
  openGraph: {
    title: "Tattoo Styles & Artistry Guide | Tattoo Iconic — Jainik Patel",
    description:
      "Explore 13 master tattoo genres from fine-line single needle to Japanese Irezumi and sacred Vedic realism. Available at Bhadam private studio & luxury home service across Gujarat.",
    url: "https://tattooiconic.com/styles",
    siteName: "Tattoo Iconic",
    images: [
      {
        url: "/images/tattoos/hanuman-tattoo.jpg",
        width: 1200,
        height: 630,
        alt: "Tattoo Iconic Master Styles Guide",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  alternates: {
    canonical: "/styles",
  },
};

export default function StylesPage() {
  return <StylesClient />;
}
