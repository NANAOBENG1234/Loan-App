import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "QuickLoan - Fast Mobile Loans in Ghana",
  description: "Get instant loans directly to your mobile money. Fast approval, low interest, no paperwork.",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">{children}</body>
    </html>
  );
}
