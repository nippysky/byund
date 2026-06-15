/**
 * BYUND Accounts — Home (authenticated)
 * Product switcher — users land here after login.
 */
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import Link from "next/link";
import { AccountNav } from "@/components/AccountNav";

const GOVERNANCE_URL = process.env.NEXT_PUBLIC_GOVERNANCE_URL ?? "https://byund-governance.vercel.app";

function Mark() {
  return (
    <svg width="26" height="26" viewBox="0 0 200 200" fill="none">
      <rect width="200" height="200" rx="44" fill="url(#ah-g)" />
      <defs>
        <linearGradient id="ah-g" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
          <stop stopColor="#b8acfe" /><stop offset="1" stopColor="#4f3dd4" />
        </linearGradient>
      </defs>
      <path opacity=".93" fillRule="evenodd" clipRule="evenodd"
        d="M62 52h46c20 0 34 12 34 30 0 10-5 19-13 24 11 5 18 15 18 28 0 20-15 34-37 34H62V52Zm28 50h16c7 0 12-5 12-12s-5-12-12-12H90v24Zm0 46h18c9 0 14-5 14-13s-5-14-14-14H90v27Z"
        fill="#fff" />
    </svg>
  );
}

/** All BYUND apps — add new ones here as they ship */
const APPS = [
  {
    href:        GOVERNANCE_URL,
    name:        "Governance",
    tagline:     "Asset reviews, findings & compliance audit",
    icon:        "🛡️",
    iconBg:      "rgba(114,96,251,0.12)",
    iconBorder:  "rgba(114,96,251,0.2)",
    status:      "live" as const,
  },
];

export default async function AccountsHome() {
  const session = await getSession();
  if (!session) redirect("/login");

  const firstName = session.name.split(" ")[0];
  const initials  = session.name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", background: "var(--bg)", color: "var(--text-1)" }}>

      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <header style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 28px", height: 60,
        borderBottom: "1px solid var(--border)",
        position: "sticky", top: 0, zIndex: 50,
        background: "var(--bg)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none" }}>
          <Mark />
          <div>
            <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.2em", color: "var(--brand)", lineHeight: 1 }}>BYUND</div>
            <div style={{ fontSize: 7, fontWeight: 600, letterSpacing: "0.22em", color: "var(--text-3)", marginTop: 2, lineHeight: 1 }}>ACCOUNTS</div>
          </div>
        </Link>
        <AccountNav name={session.name} email={session.email} initials={initials} />
      </header>

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <main style={{ flex: 1, maxWidth: 560, width: "100%", margin: "0 auto", padding: "56px 24px 80px" }}>

        {/* Greeting */}
        <div style={{ marginBottom: 36 }}>
          <h1 style={{ fontSize: "clamp(22px, 3.5vw, 30px)", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: 6 }}>
            Welcome back, {firstName}.
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-3)", lineHeight: 1.6 }}>
            Your BYUND apps — one account for everything.
          </p>
        </div>

        {/* App list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {APPS.map(app => (
            <a
              key={app.href}
              href={app.href}
              className="app-row"
            >
              <div className="app-icon" style={{ background: app.iconBg, border: `1px solid ${app.iconBorder}` }}>
                {app.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-1)", marginBottom: 2 }}>{app.name}</div>
                <div style={{ fontSize: 12, color: "var(--text-3)", lineHeight: 1.4 }}>{app.tagline}</div>
              </div>
              <div className="app-arrow">→</div>
            </a>
          ))}
        </div>

        {/* Footer hint */}
        <p style={{ marginTop: 32, fontSize: 12, color: "var(--text-3)" }}>
          More apps coming soon.
        </p>
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer style={{
        borderTop: "1px solid var(--border)", padding: "18px 28px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 10,
      }}>
        <p style={{ fontSize: 11, color: "var(--text-3)" }}>© {new Date().getFullYear()} NIPPYSKY LIMITED</p>
        <div style={{ display: "flex", gap: 18 }}>
          {[["https://byund.com/privacy","Privacy"],["https://byund.com/terms","Terms"]].map(([h,l]) => (
            <Link key={h} href={h} style={{ fontSize: 11, color: "var(--text-3)", textDecoration: "none" }}>{l}</Link>
          ))}
        </div>
      </footer>

      {/* ── CSS ─────────────────────────────────────────────────────────── */}
      <style>{`
        .app-row {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 18px 20px;
          border-radius: 16px;
          background: var(--surface-1);
          border: 1px solid var(--border-med);
          text-decoration: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .app-row:hover {
          border-color: var(--brand);
          box-shadow: 0 4px 20px rgba(114,96,251,0.1);
        }
        .app-icon {
          width: 44px; height: 44px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 20px; flex-shrink: 0;
        }
        .app-arrow {
          font-size: 16px;
          color: var(--text-3);
          flex-shrink: 0;
          transition: transform 0.15s, color 0.15s;
        }
        .app-row:hover .app-arrow {
          transform: translateX(3px);
          color: var(--brand-hi);
        }
      `}</style>
    </div>
  );
}
