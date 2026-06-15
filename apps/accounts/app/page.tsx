/**
 * BYUND Accounts — Home (authenticated)
 *
 * Google-style product switcher. Users land here when they log in directly
 * at byund-accounts.vercel.app with no ?next= param.
 *
 * When a user logs in FROM a BYUND product (e.g. governance adds ?next=...),
 * they are redirected back to that product — they never see this page in that flow.
 *
 * As we add new BYUND products, add them to PRODUCTS below.
 */
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import Link from "next/link";

const GOVERNANCE_URL = process.env.NEXT_PUBLIC_GOVERNANCE_URL ?? "https://byund-governance.vercel.app";

const PRODUCTS = [
  {
    name:      "Governance",
    tagline:   "Asset reviews, findings & compliance audit trail",
    url:       GOVERNANCE_URL,
    icon:      "🛡️",
    color:     "#7260fb",
    available: true,
  },
  {
    name:      "Payments",
    tagline:   "Payment links, invoices & settlement dashboard",
    url:       "#",
    icon:      "💳",
    color:     "#10b981",
    available: false,
  },
  {
    name:      "Analytics",
    tagline:   "Real-time metrics across all BYUND products",
    url:       "#",
    icon:      "📊",
    color:     "#f59e0b",
    available: false,
  },
  {
    name:      "Vault",
    tagline:   "Secrets, API keys & credential management",
    url:       "#",
    icon:      "🔐",
    color:     "#6366f1",
    available: false,
  },
];

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

  const initials = session.name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2);

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
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#7260fb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
            {initials}
          </div>
          <form action="/api/auth/logout" method="POST">
            <button type="submit" style={{ fontSize: 12, color: "#777", background: "none", border: "1px solid #222", borderRadius: 7, padding: "5px 12px", cursor: "pointer", fontFamily: "inherit" }}>
              Sign out
            </button>
          </form>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ textAlign: "center", padding: "60px 24px 44px" }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#7260fb", textTransform: "uppercase", marginBottom: 12 }}>
          Good to see you
        </p>
        <h1 style={{ fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.1, marginBottom: 12 }}>
          What are you working on,<br />{session.name.split(" ")[0]}?
        </h1>
        <p style={{ fontSize: 14, color: "#666", maxWidth: 400, margin: "0 auto" }}>
          One BYUND account gives you access to every product below.
        </p>
      </div>

      {/* Product grid */}
      <div style={{ maxWidth: 880, margin: "0 auto", padding: "0 24px 80px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 18 }}>
        {PRODUCTS.map((p) => {
          const card = (
            <div style={{
              background: "#0b0b18",
              border: `1.5px solid ${p.available ? "#1c1c2e" : "#0f0f1a"}`,
              borderRadius: 18,
              padding: "26px 26px 22px",
              opacity: p.available ? 1 : 0.5,
              textDecoration: "none",
              display: "block",
              color: "inherit",
              transition: "border-color 0.15s, box-shadow 0.15s",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <span style={{ fontSize: 26 }}>{p.icon}</span>
                {p.available ? (
                  <span style={{ fontSize: 10, fontWeight: 700, color: p.color, background: `${p.color}18`, border: `1px solid ${p.color}30`, borderRadius: 5, padding: "3px 8px", letterSpacing: "0.05em" }}>
                    OPEN
                  </span>
                ) : (
                  <span style={{ fontSize: 10, fontWeight: 600, color: "#444", background: "#111", border: "1px solid #1a1a1a", borderRadius: 5, padding: "3px 8px", letterSpacing: "0.05em" }}>
                    SOON
                  </span>
                )}
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{p.name}</div>
              <div style={{ fontSize: 12, color: "#555", lineHeight: 1.65 }}>{p.tagline}</div>
            </div>
          );

          return p.available ? (
            <a key={p.name} href={p.url} style={{ textDecoration: "none", display: "block" }}
              onMouseEnter={(e) => {
                const el = e.currentTarget.firstChild as HTMLElement;
                el.style.borderColor = p.color;
                el.style.boxShadow = `0 6px 28px ${p.color}22`;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget.firstChild as HTMLElement;
                el.style.borderColor = "#1c1c2e";
                el.style.boxShadow = "none";
              }}>
              {card}
            </a>
          ) : (
            <div key={p.name}>{card}</div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", padding: "24px", borderTop: "1px solid #111" }}>
        <p style={{ fontSize: 11, color: "#444" }}>
          © {new Date().getFullYear()} NIPPYSKY LIMITED ·{" "}
          <Link href="https://byund.com/privacy" style={{ color: "#444", textDecoration: "none" }}>Privacy</Link> ·{" "}
          <Link href="https://byund.com/terms" style={{ color: "#444", textDecoration: "none" }}>Terms</Link>
        </p>
      </div>
    </div>
  );
}
