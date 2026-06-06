import type { Metadata } from "next";
import SiteChrome from "@/components/site-chrome";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hubli Dharwad App — Verified Properties in Hubballi",
  description: "Find verified flats, houses and plots in Hubballi. Matched with real local demand, video tours, and WhatsApp support.",
  manifest: '/manifest.json',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
