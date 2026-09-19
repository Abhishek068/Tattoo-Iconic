import type { Metadata } from "next";
import { LoginClient } from "@/components/pages/LoginClient";

export const metadata: Metadata = {
  title: "Artist & Client Login | Tattoo Iconic",
  description: "Secure login portal for Tattoo Iconic dashboard and appointment management.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return <LoginClient />;
}
