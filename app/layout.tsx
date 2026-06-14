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
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      {/* Prevent flash of wrong theme */}
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('byund-theme')||((window.matchMedia&&window.matchMedia('(prefers-color-scheme: light)').matches)?'light':'dark');document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`,
          }}
        />
      </head>
      <body
        className={`${publicSans.variable}`}
        style={{ fontFamily: "var(--font-public-sans), system-ui, sans-serif" }}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
