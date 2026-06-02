import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MasterHD — Properties in Hubli-Dharwad",
  description: "Find properties for rent and sale in Hubli-Dharwad. Verified local listings with video tours.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}