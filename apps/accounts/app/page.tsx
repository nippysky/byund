/**
 * BYUND Accounts — Home (authenticated)
 *
 * One-account product switcher. Users land here when they log in directly
 * at byund-accounts.vercel.app with no ?next= param.
 *
 * Keep it simple: show only live products. No "coming soon" noise.
 */
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import Link from "next/link";

const GOVERNANCE_URL = process.env.NEXT_PUBLIC_GOVERNANCE_URL ?? "https://byund-governance.vercel.app";

function Mark() {
  return (
    <svg width="30" height="30" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="44" fill="url(#acct-g)" />
      <defs>
        <linearGradient id="acct-g" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
          <stop stopColor="#b8acfe" /><stop offset="1" stopColor="#4f3dd4" />
        </linearGradient>
      </defs>
      <path opacity=".93" fillRule="evenodd" clipRule="evenodd"
        d="M62 52h46c20 0 34 12 34 30 0 10-5 19-13 24 11 5 18 15 18 28 0 20-15 34-37 34H62V52Zm28 50h16c7 0 12-5 12-12s-5-12-12-12H90v24Zm0 46h18c9 0 14-5 14-13s-5-14-14-14H90v27Z"
        fill="#fff" />
    </svg>
  );
}

export default async function AccountsHome() {
  const session = await getSession();
  if (!session) redirect("/login");

  const initials = session.name
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div style={{ minHeight: "100dvh", background: "var(--bg, #07070f)", color: "var(--text-1, #f1f1f5)", fontFamily: "system-ui, sans-serif" }}>

      {/* Nav */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 32px", borderBottom: "1px solid #161626" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <Mark />
          <div>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.18em", color: "#7260fb", lineHeight: 1 }}>BYUND</div>
            <div style={{ fontSize: 8, fontWeight: 600, letterSpacing: "0.22em", color: "#555", marginTop: 2 }}>ACCOUNTS</div>
          </div>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{session.name}</div>
            <div style={{ fontSize: 11, color: "#666" }}>{session.email}</div>
          </div>
          <div style={{
            width: 34, height: 34, borderRadius: "50%",
            background: "#7260fb", display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 12, fontWeight: 700,
            color: "#fff", flexShrink: 0,
          }}>
            {initials}
          </div>
          <form action="/api/auth/logout" method="POST">
            <button type="submit" style={{
              fontSize: 12, color: "#777", background: "none",
              border: "1px solid #222", borderRadius: 7, padding: "5px 12px",
              cursor: "pointer", fontFamily: "inherit",
            }}>
              Sign out
            </button>
          </form>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ textAlign: "center", padding: "64px 24px 48px" }}>
        <h1 style={{ fontSize: "clamp(24px, 3.5vw, 38px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.1, marginBottom: 14 }}>
          Welcome back, {session.name.split(" ")[0]}
        </h1>
        <p style={{ fontSize: 14, color: "#666", maxWidth: 360, margin: "0 auto" }}>
          One account for everything BYUND.
        </p>
      </div>

      {/* Products */}
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "0 24px 80px" }}>
        <a
          href={GOVERNANCE_URL}
          style={{ textDecoration: "none", display: "block" }}
          onMouseEnter={e => {
            const el = e.currentTarget.firstChild as HTMLElement;
            el.style.borderColor = "#7260fb";
            el.style.boxShadow = "0 6px 32px rgba(114,96,251,0.18)";
          }}
          onMouseLeave={e => {
            const el = e.currentTarget.firstChild as HTMLElement;
            el.style.borderColor = "#1c1c2e";
            el.style.boxShadow = "none";
          }}
        >
          <div style={{
            background: "#0b0b18", border: "1.5px solid #1c1c2e",
            borderRadius: 18, padding: "28px 28px 24px",
            display: "flex", alignItems: "center", gap: 20,
            transition: "border-color 0.15s, box-shadow 0.15s",
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: 13, flexShrink: 0,
              background: "rgba(114,96,251,0.12)", border: "1px solid rgba(114,96,251,0.25)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 24,
            }}>
              🛡️
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Governance</div>
              <div style={{ fontSize: 13, color: "#555", lineHeight: 1.6 }}>
                Asset reviews, findings & compliance audit trail
              </div>
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#7260fb", background: "rgba(114,96,251,0.1)", border: "1px solid rgba(114,96,251,0.25)", borderRadius: 5, padding: "4px 10px", letterSpacing: "0.05em", flexShrink: 0 }}>
              OPEN →
            </div>
          </div>
        </a>
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", padding: "20px 24px", borderTop: "1px solid #111" }}>
        <p style={{ fontSize: 11, color: "#333" }}>
          © {new Date().getFullYear()} NIPPYSKY LIMITED ·{" "}
          <Link href="https://byund.com/privacy" style={{ color: "#444", textDecoration: "none" }}>Privacy</Link>
          {" · "}
          <Link href="https://byund.com/terms" style={{ color: "#444", textDecoration: "none" }}>Terms</Link>
        </p>
      </div>
    </div>
  );
}
