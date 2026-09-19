import type { Metadata } from "next";
import { ContactClient } from "@/components/pages/ContactClient";

export const metadata: Metadata = {
  title: "Contact Jainik Patel | Tattoo Studio Bhadam, Rajpipla, Gujarat",
  description:
    "Get in touch with Master Tattoo Artist Jainik Patel. Studio location in Bhadam, Rajpipla, Narmada, Gujarat. Call/WhatsApp: +91 8238767100. Direct consultation and home service inquiries.",
  keywords: [
    "contact tattoo artist Rajpipla",
    "tattoo studio Bhadam Narmada address",
    "Jainik Patel phone number",
    "Tattoo Iconic contact details",
    "Gujarat tattoo artist WhatsApp",
  ],
  alternates: {
    canonical: "https://tattooiconic.in/contact",
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
