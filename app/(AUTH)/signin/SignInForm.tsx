"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";

const ACCOUNTS_URL   = process.env.NEXT_PUBLIC_ACCOUNTS_URL   ?? "https://byund-accounts.vercel.app";
const GOVERNANCE_URL = process.env.NEXT_PUBLIC_GOVERNANCE_URL ?? "https://byund-governance.vercel.app";

/**
 * SignInForm — SSO gateway.
 *
 * BYUND uses a central accounts app for authentication (like Google Accounts).
 * This component redirects users to accounts.byund.com/login with a ?next
 * callback pointing at the governance app's /auth/callback endpoint.
 *
 * After a successful login on accounts, the user is sent back to governance
 * with a verified JWT that sets the session cookie.
 */
export function SignInForm({ nextPath }: { nextPath: string }) {
  const callbackUrl = `${GOVERNANCE_URL}/auth/callback`;

  // Auto-redirect after a brief moment so the user sees the branded page
  useEffect(() => {
    const t = setTimeout(() => {
      window.location.href = `${ACCOUNTS_URL}/login?next=${encodeURIComponent(callbackUrl)}`;
    }, 800);
    return () => clearTimeout(t);
  }, [callbackUrl]);

  const handleClick = () => {
    window.location.href = `${ACCOUNTS_URL}/login?next=${encodeURIComponent(callbackUrl)}`;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* SSO button */}
      <button
        onClick={handleClick}
        style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
          width: "100%", padding: "14px 20px", borderRadius: "12px",
          background: "var(--brand)", color: "#fff",
          fontSize: "15px", fontWeight: 700, letterSpacing: "-0.01em",
          border: "none", cursor: "pointer",
          boxShadow: "0 4px 24px rgba(114,96,251,0.35)",
          fontFamily: "inherit",
          transition: "opacity 0.15s",
        }}
        onMouseEnter={e => ((e.target as HTMLButtonElement).style.opacity = "0.88")}
        onMouseLeave={e => ((e.target as HTMLButtonElement).style.opacity = "1")}
      >
        <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} />
        Continue to BYUND Accounts
        <ArrowRight size={15} />
      </button>

      {/* Divider + note */}
      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: "12px", color: "var(--text-3)", lineHeight: 1.7 }}>
          You&apos;ll be redirected to <strong style={{ color: "var(--text-2)" }}>accounts.byund.com</strong> to sign in securely.
          <br />One account works across all BYUND products.
        </p>
      </div>

      <div style={{ borderTop: "1px solid var(--border)", paddingTop: "20px", textAlign: "center" }}>
        <p style={{ fontSize: "13px", color: "var(--text-3)" }}>
          New to BYUND?{" "}
          <Link
            href={`${ACCOUNTS_URL}/register?next=${encodeURIComponent(callbackUrl)}`}
            style={{ color: "var(--brand-hi)", fontWeight: 600 }}
          >
            Create an account
          </Link>
        </p>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
