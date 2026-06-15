import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import { Toaster } from "sonner";
import { AuthProvider } from "@/contexts/auth-context";
import "./globals.css";

const publicSans = Public_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-public-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "BYUND Governance", template: "%s | BYUND Governance" },
  description: "Asset ownership, reviews and audit governance for modern IT teams.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `(function(){try{var c=document.cookie.match(/byund-theme=([^;]+)/);var t=localStorage.getItem('byund-theme')||(c&&c[1])||((window.matchMedia&&window.matchMedia('(prefers-color-scheme:light)').matches)?'light':'dark');document.documentElement.setAttribute('data-theme',t);localStorage.setItem('byund-theme',t);document.cookie='byund-theme='+t+'; path=/; max-age=31536000; SameSite=Lax';}catch(e){}})();`
        }} />
      </head>
      <body className={publicSans.variable} style={{ fontFamily: "var(--font-public-sans), system-ui, sans-serif" }}>
        <AuthProvider>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: { background: "var(--card)", border: "1px solid var(--border)", color: "var(--text)" },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
