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

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "TattooParlor",
  "@id": "https://tattooiconic.in/#organization",
  name: "Tattoo Iconic",
  alternateName: "Tattoo Iconic by Jainik Patel",
  description:
    "Premier bespoke custom tattoo studio by Solo Master Artist Jainik Patel. Specializing in sacred spiritual tattoos, dark realism, fine-line, and portraits. Private studio in Bhadam, Rajpipla and luxury mobile doorstep service across Gujarat.",
  url: "https://tattooiconic.in",
  logo: "https://tattooiconic.in/images/tattoo-iconic-logo.png",
  image: "https://tattooiconic.in/images/hero/slide-1-lion-crown.jpg",
  telephone: "+918238767100",
  email: "jainikpatel.tattoo@gmail.com",
  priceRange: "₹₹",
  currenciesAccepted: "INR",
  paymentAccepted: "Cash, UPI, Credit Card, Bank Transfer",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Bhadam, Main Road",
    addressLocality: "Rajpipla",
    addressRegion: "Gujarat",
    postalCode: "393145",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 21.8687,
    longitude: 73.5027,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "10:00",
      closes: "21:00",
    },
  ],
  sameAs: [
    "https://instagram.com/jainikpatel.tattoo",
    "https://wa.me/918238767100",
  ],
  founder: {
    "@type": "Person",
    name: "Jainik Patel",
    jobTitle: "Master Tattoo Artist & Founder",
    image: "https://tattooiconic.in/images/tattoo-iconic-logo.png",
  },
  areaServed: [
    {
      "@type": "AdministrativeArea",
      name: "Rajpipla",
    },
    {
      "@type": "AdministrativeArea",
      name: "Narmada",
    },
    {
      "@type": "AdministrativeArea",
      name: "Vadodara",
    },
    {
      "@type": "AdministrativeArea",
      name: "Surat",
    },
    {
      "@type": "AdministrativeArea",
      name: "Bharuch",
    },
    {
      "@type": "AdministrativeArea",
      name: "Gujarat",
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fontDisplay.variable} ${fontBody.variable} ${fontSerif.variable} dark`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
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
