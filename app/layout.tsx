import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import SiteChrome from "@/components/site-chrome";
import NumberInputGuard from "@/components/number-input-guard";
import { APP_URL } from "@/lib/env";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: "HubliDharwad.app — Verified Properties in Hubballi-Dharwad",
  description: "Find verified flats, houses and plots in Hubballi-Dharwad. Matched with real local demand, video tours, and WhatsApp support.",
  manifest: '/manifest.json',
  openGraph: {
    siteName: "HubliDharwad.app",
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={outfit.variable}>
      <body>
        <NumberInputGuard />
        <SiteChrome>{children}</SiteChrome>
        <Analytics />
      </body>
    </html>
  );
}
