// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Public_Sans } from "next/font/google";
import Providers from "./providers";

const publicSans = Public_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-public-sans",
});

export const metadata: Metadata = {
  title: "BYUND — Infrastructure You Can Trust",
  description:
    "BYUND is the modern platform for IT governance, asset ownership, and audit readiness. Know what you own, who owns it, and when it was last reviewed.",
  keywords: ["IT governance", "asset management", "audit", "compliance", "BYUND", "NIPPYSKY"],
  authors: [{ name: "NIPPYSKY LIMITED" }],
  openGraph: {
    title: "BYUND — Infrastructure You Can Trust",
    description: "Asset ownership, reviews and audit governance for modern IT teams.",
    siteName: "BYUND",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`
          ${publicSans.variable}
          font-sans
          bg-background
          text-foreground
          antialiased
          min-h-screen
        `}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
