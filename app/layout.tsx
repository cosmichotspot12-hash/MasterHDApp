import type { Metadata } from "next";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
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
        <SiteHeader />
        <div className="min-h-[calc(100vh-64px)]">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}