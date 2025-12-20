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
  title: "BYUND – Beyond Borders. Global USD Payments.",
  description:
    "BYUND is a modern payment rail that helps businesses receive and manage USD-denominated payments globally with a simple, clean checkout experience.",
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
