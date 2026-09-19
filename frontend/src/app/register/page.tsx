import type { Metadata } from "next";
import { RegisterClient } from "@/components/pages/RegisterClient";

export const metadata: Metadata = {
  title: "Create Account | Tattoo Iconic",
  description: "Register an account to book sessions and manage custom tattoo requests with Jainik Patel.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RegisterPage() {
  return <RegisterClient />;
}
