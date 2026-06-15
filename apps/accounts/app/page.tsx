/**
 * BYUND Accounts — Home (authenticated)
 * Product switcher — users land here after login with no ?next= param.
 */
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import Link from "next/link";
import { AccountNav } from "@/components/AccountNav";

const GOVERNANCE_URL = process.env.NEXT_PUBLIC_GOVERNANCE_URL ?? "https://byund-governance.vercel.app";

function Mark() {
  return (
    <svg width="28" height="28" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="44" fill="url(#acct-home-g)" />
      <defs>
        <linearGradient id="acct-home-g" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
          <stop stopColor="#b8acfe" /><stop offset="1" stopColor="#4f3dd4" />
        </linearGradient>
      </defs>
      <path opacity=".93" fillRule="evenodd" clipRule="evenodd"
        d="M62 52h46c20 0 34 12 34 30 0 10-5 19-13 24 11 5 18 15 18 28 0 20-15 34-37 34H62V52Zm28 50h16c7 0 12-5 12-12s-5-12-12-12H90v24Zm0 46h18c9 0 14-5 14-13s-5-14-14-14H90v27Z"
        fill="#fff" />
    </svg>
  );
}

const PRODUCTS = [
  {
    href:        GOVERNANCE_URL,
    icon:        "🛡️",
    name:        "Governance",
    description: "Asset reviews, findings & compliance",
    accent:      "rgba(114,96,251,0.12)",
    borderAccent:"rgba(114,96,251,0.25)",
  },
];

export default async function AccountsHome() {
  const session = await getSession();
  if (!session) redirect("/login");

  const firstName = session.name.split(" ")[0];
  const initials  = session.name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", background: "var(--bg)", color: "var(--text-1)" }}>

      {/* ── Nav ─────────────────────────────────────────────────────── */}
      <header style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 28px", height: 60,
        borderBottom: "1px solid var(--border)",
        position: "sticky", top: 0, zIndex: 50,
        background: "var(--bg)",
        backdropFilter: "blur(20px) saturate(1.6)",
        WebkitBackdropFilter: "blur(20px) saturate(1.6)",
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none" }}>
          <Mark />
          <div>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.18em", color: "var(--brand)", lineHeight: 1 }}>BYUND</div>
            <div style={{ fontSize: 7.5, fontWeight: 600, letterSpacing: "0.22em", color: "var(--text-3)", marginTop: 2, lineHeight: 1 }}>ACCOUNTS</div>
          </div>
        </Link>

        {/* Theme toggle lives only inside AccountNav dropdown now */}
        <AccountNav name={session.name} email={session.email} initials={initials} />
      </header>

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "64px 24px 80px" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", color: "var(--brand-hi)", textTransform: "uppercase", marginBottom: 14, opacity: 0.8 }}>
            Your products
          </p>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, letterSpacing: "-0.045em", lineHeight: 1.05, marginBottom: 12 }}>
            Welcome back, {firstName}.
          </h1>
          <p style={{ fontSize: 15, color: "var(--text-2)", lineHeight: 1.7 }}>
            One account for everything BYUND.
          </p>
        </div>

        {/* ── Product Grid ─────────────────────────────────────────── */}
        <div className="product-grid">
          {PRODUCTS.map(p => (
            <a key={p.href} href={p.href} className="product-card">
              <div className="product-icon" style={{ background: p.accent, borderColor: p.borderAccent }}>
                {p.icon}
              </div>
              <div className="product-name">{p.name}</div>
              <div className="product-desc">{p.description}</div>
              <div className="product-cta">Open →</div>
            </a>
          ))}

          {/* ── Suggest / Request an app ───────────────────────────── */}
          <a href="mailto:hello@byund.com?subject=App+suggestion" className="product-card product-card--suggest">
            <div className="product-icon product-icon--plus">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <line x1="11" y1="4" x2="11" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="4" y1="11" x2="18" y2="11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="product-name" style={{ color: "var(--text-3)" }}>Suggest an app</div>
            <div className="product-desc">Have an idea? Tell us what you'd like to see next on BYUND.</div>
            <div className="product-cta" style={{ color: "var(--text-3)" }}>Send idea →</div>
          </a>
        </div>
      </main>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <footer style={{
        borderTop: "1px solid var(--border)", padding: "20px 28px",
        display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
      }}>
        <p style={{ fontSize: 11, color: "var(--text-3)" }}>
          © {new Date().getFullYear()} NIPPYSKY LIMITED
        </p>
        <div style={{ display: "flex", gap: 18 }}>
          {[
            ["https://byund.com/privacy",  "Privacy"],
            ["https://byund.com/terms",    "Terms"],
            ["https://byund.com/security", "Security"],
          ].map(([href, label]) => (
            <Link key={href} href={href} style={{ fontSize: 11, color: "var(--text-3)", textDecoration: "none" }}>
              {label}
            </Link>
          ))}
        </div>
      </footer>

      {/* ── CSS ─────────────────────────────────────────────────────── */}
      <style>{`
        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 16px;
          width: 100%;
          max-width: 680px;
        }
        .product-card {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 12px;
          padding: 24px 20px;
          border-radius: 18px;
          background: var(--surface-1);
          border: 1.5px solid var(--border-med);
          text-decoration: none;
          color: inherit;
          transition: border-color 0.15s, box-shadow 0.15s, transform 0.15s;
          aspect-ratio: 1;
          justify-content: flex-end;
        }
        .product-card:hover {
          border-color: var(--brand);
          box-shadow: 0 8px 36px rgba(114,96,251,0.15);
          transform: translateY(-2px);
        }
        .product-card--suggest {
          border-style: dashed;
          border-color: var(--border);
        }
        .product-card--suggest:hover {
          border-color: var(--text-3);
          box-shadow: none;
        }
        .product-icon {
          width: 52px; height: 52px; border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          font-size: 24px;
          border: 1px solid transparent;
          flex-shrink: 0;
        }
        .product-icon--plus {
          background: var(--surface-2) !important;
          border-color: var(--border-med) !important;
          color: var(--text-3);
        }
        .product-name {
          font-size: 15px;
          font-weight: 700;
          color: var(--text-1);
          line-height: 1.2;
        }
        .product-desc {
          font-size: 12px;
          color: var(--text-3);
          line-height: 1.5;
          flex: 1;
        }
        .product-cta {
          font-size: 11px;
          font-weight: 700;
          color: var(--brand-hi);
          letter-spacing: 0.02em;
        }
        @media (max-width: 480px) {
          .product-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </div>
  );
}
