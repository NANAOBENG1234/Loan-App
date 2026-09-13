import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { PwaRegister } from "@/components/PwaRegister";

export const metadata: Metadata = {
  title: "BoA Micro Finance - Fast Mobile Loans in Ghana",
  description: "Get instant loans directly to your mobile money. Fast approval, low interest, no paperwork.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.svg",
    apple: "/icons/icon-192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#15803d",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        {children}
        <PwaRegister />
      </body>
    </html>
  );
}
