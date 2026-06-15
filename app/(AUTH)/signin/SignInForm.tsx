"use client";

const ACCOUNTS_URL = process.env.NEXT_PUBLIC_ACCOUNTS_URL ?? "https://byund-accounts.vercel.app";

/**
 * Marketing sign-in — direct link to BYUND Accounts.
 * No ?next param = after login the user lands on the BYUND app directory.
 */
export function SignInForm({ nextPath: _ }: { nextPath: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <a
        href={ACCOUNTS_URL}
        style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          width: "100%", padding: "14px 20px", borderRadius: 12,
          background: "var(--brand)", color: "#fff",
          fontSize: 15, fontWeight: 700, letterSpacing: "-0.01em",
          textDecoration: "none",
          boxShadow: "0 4px 24px rgba(114,96,251,0.35)",
          transition: "opacity 0.12s",
        }}
        onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.opacity = "0.85")}
        onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.opacity = "1")}
      >
        Sign in to BYUND
      </a>
      <p style={{ textAlign: "center", fontSize: 13, color: "var(--text-3)", margin: 0 }}>
        New?{" "}
        <a href={`${ACCOUNTS_URL}/register`} style={{ color: "var(--brand-hi)", fontWeight: 600, textDecoration: "none" }}>
          Create a free account
        </a>
      </p>
    </div>
  );
}
