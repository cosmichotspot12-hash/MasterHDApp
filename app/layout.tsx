import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import SiteChrome from "@/components/site-chrome";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hubli Dharwad App — Verified Properties in Hubballi",
  description: "Find verified flats, houses and plots in Hubballi. Matched with real local demand, video tours, and WhatsApp support.",
  manifest: '/manifest.json',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={outfit.variable}>
      <body>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
