import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Public_Sans } from "next/font/google";
import Providers from "./providers";

// ─────────────────────────────────────────────
// Font
// ─────────────────────────────────────────────
const publicSans = Public_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-public-sans",
  display: "swap",    // prevents FOIT — text stays visible during load
  preload: true,
});

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────
const BASE_URL = "https://byund.com";
const SITE_NAME = "BYUND";
const DEFAULT_TITLE = "BYUND — Infrastructure You Can Trust";
const DEFAULT_DESCRIPTION =
  "BYUND is the modern platform for IT governance, asset ownership tracking, review scheduling, and audit readiness. Know what you own. Know who owns it.";
const OG_IMAGE = `${BASE_URL}/opengraph-image`;

// ─────────────────────────────────────────────
// Metadata — FAANG-grade
// Next.js merges this with page-level metadata exports.
// ─────────────────────────────────────────────
export const metadata: Metadata = {
  // Base URL used to resolve relative metadata URLs
  metadataBase: new URL(BASE_URL),

  // Title template: page exports `title: "Governance"` → renders "Governance | BYUND"
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },

  description: DEFAULT_DESCRIPTION,

  keywords: [
    "IT governance",
    "asset management",
    "audit readiness",
    "compliance platform",
    "asset ownership tracking",
    "review scheduling",
    "IT audit",
    "SaaS governance",
    "BYUND",
    "NIPPYSKY",
    "IT compliance Nigeria",
    "enterprise IT governance",
  ],

  authors: [{ name: "NIPPYSKY LIMITED", url: BASE_URL }],
  creator: "NIPPYSKY LIMITED",
  publisher: "NIPPYSKY LIMITED",

  // Canonical + alternates
  alternates: {
    canonical: BASE_URL,
    languages: {
      "en-US": BASE_URL,
      "en-GB": BASE_URL,
    },
  },

  // Category for app stores / directory listings
  category: "technology",

  // ── Open Graph ─────────────────────────────
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "BYUND — IT Governance Platform",
        type: "image/png",
      },
    ],
  },

  // ── Twitter / X Card ───────────────────────
  twitter: {
    card: "summary_large_image",
    site: "@byund",
    creator: "@nippysky",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [OG_IMAGE],
  },

  // ── Icons ──────────────────────────────────
  // Next.js auto-serves app/icon.tsx and app/apple-icon.tsx —
  // this block adds additional explicit declarations for maximum compatibility.
  icons: {
    icon: [
      { url: "/icon.png",    type: "image/png", sizes: "32x32"   },
      { url: "/byund-mark.svg", type: "image/svg+xml"             },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/icon.png",
  },

  // ── Manifest ───────────────────────────────
  manifest: "/manifest.webmanifest",

  // ── Robots ─────────────────────────────────
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,      // allow full-length video previews
      "max-image-preview": "large", // show large image thumbnails in Search
      "max-snippet": -1,            // no snippet length limit
    },
  },

  // ── Verification ───────────────────────────
  // Add your real tokens here when you verify in Search Console / Bing
  // verification: {
  //   google: "YOUR_GOOGLE_SITE_VERIFICATION_TOKEN",
  //   yandex: "YOUR_YANDEX_TOKEN",
  //   bing:   "YOUR_BING_TOKEN",
  // },

  // ── App / PWA ──────────────────────────────
  applicationName: SITE_NAME,
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: SITE_NAME,
  },
  formatDetection: {
    telephone: false, // prevent iOS from auto-linking phone numbers
    email: false,
    address: false,
  },
};

// ─────────────────────────────────────────────
// Viewport — separate from metadata in Next.js 14+
// ─────────────────────────────────────────────
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)",  color: "#050609" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "dark light",
};

// ─────────────────────────────────────────────
// JSON-LD Structured Data
// ─────────────────────────────────────────────
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    // Organisation
    {
      "@type": "Organization",
      "@id": `${BASE_URL}/#org`,
      name: "NIPPYSKY LIMITED",
      url: BASE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/byund-mark.svg`,
        width: 200,
        height: 200,
      },
      sameAs: [],
      contactPoint: {
        "@type": "ContactPoint",
        email: "hello@nippysky.com",
        contactType: "customer support",
        availableLanguage: "English",
      },
    },
    // SoftwareApplication (BYUND)
    {
      "@type": "SoftwareApplication",
      "@id": `${BASE_URL}/#app`,
      name: "BYUND",
      url: BASE_URL,
      description: DEFAULT_DESCRIPTION,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        description: "Free during early access",
      },
      publisher: { "@id": `${BASE_URL}/#org` },
    },
    // WebSite (for sitelinks search box)
    {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      url: BASE_URL,
      name: SITE_NAME,
      description: DEFAULT_DESCRIPTION,
      publisher: { "@id": `${BASE_URL}/#org` },
    },
  ],
};

// ─────────────────────────────────────────────
// Root Layout
// ─────────────────────────────────────────────
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
    >
      <head>
        {/* ── Theme flash prevention ── */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var c=document.cookie.match(/byund-theme=([^;]+)/);var t=localStorage.getItem('byund-theme')||(c&&c[1])||((window.matchMedia&&window.matchMedia('(prefers-color-scheme: light)').matches)?'light':'dark');document.documentElement.setAttribute('data-theme',t);localStorage.setItem('byund-theme',t);document.cookie='byund-theme='+t+'; path=/; max-age=31536000; SameSite=Lax';}catch(e){}})();`,
          }}
        />

        {/* ── Preconnect for performance ── */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* ── DNS prefetch for likely third-party domains ── */}
        <link rel="dns-prefetch" href="//vercel-insights.com" />

        {/* ── JSON-LD structured data ── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={publicSans.variable}
        style={{ fontFamily: "var(--font-public-sans), system-ui, sans-serif" }}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
