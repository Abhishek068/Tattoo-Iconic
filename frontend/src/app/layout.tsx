import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans, Cinzel } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { Providers } from "./providers";
import "@/styles/globals.css";

const fontDisplay = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-display",
  display: "swap",
});

const fontBody = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const fontSerif = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Tattoo Iconic | Jainik Patel — Master Tattoo Studio & Luxury Home Service",
    template: "%s | Tattoo Iconic",
  },
  description:
    "Official website of Tattoo Iconic by Solo Master Tattoo Artist Jainik Patel. 10+ years experience, 7,000+ people inked. Private studio in Bhadam, Rajpipla and luxury mobile home service across Gujarat.",
  keywords: [
    "Tattoo Iconic",
    "Jainik Patel tattoo artist",
    "Bhadam Rajpipla tattoo studio",
    "Gujarat home tattoo service",
    "fine line tattoo artist",
    "dark realism tattoo",
    "spiritual Mahadev Hanuman tattoo",
    "custom tattoo booking Gujarat",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Tattoo Iconic",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fontDisplay.variable} ${fontBody.variable} ${fontSerif.variable} dark`}>
      <body className="min-h-screen bg-ink-950 text-ink-100 antialiased selection:bg-brand selection:text-white">
        <Providers>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#181922",
                color: "#f6f6f7",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "0.75rem",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
