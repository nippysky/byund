import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import Link from "next/link";
import { AccountNav, ThemeToggle } from "@/components/AccountNav";

function Mark() {
  return (
    <svg width="28" height="28" viewBox="0 0 200 200" fill="none">
      <rect width="200" height="200" rx="44" fill="url(#s-g)" />
      <defs><linearGradient id="s-g" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse"><stop stopColor="#b8acfe" /><stop offset="1" stopColor="#4f3dd4" /></linearGradient></defs>
      <path opacity=".93" fillRule="evenodd" clipRule="evenodd" d="M62 52h46c20 0 34 12 34 30 0 10-5 19-13 24 11 5 18 15 18 28 0 20-15 34-37 34H62V52Zm28 50h16c7 0 12-5 12-12s-5-12-12-12H90v24Zm0 46h18c9 0 14-5 14-13s-5-14-14-14H90v27Z" fill="#fff" />
    </svg>
  );
}

const SettingsNav = [
  { label: "Account",  href: "/settings" },
  { label: "Security", href: "/settings/security" },
];

export default async function SettingsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const initials = session.name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", background: "var(--bg)", color: "var(--text-1)" }}>

      {/* Nav */}
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", height: 60, borderBottom: "1px solid var(--border)", position: "sticky", top: 0, zIndex: 50, background: "var(--bg)" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none" }}>
          <Mark />
          <div>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.18em", color: "var(--brand)", lineHeight: 1 }}>BYUND</div>
            <div style={{ fontSize: 7.5, fontWeight: 600, letterSpacing: "0.22em", color: "var(--text-3)", marginTop: 2, lineHeight: 1 }}>ACCOUNTS</div>
          </div>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <ThemeToggle />
          <AccountNav name={session.name} email={session.email} initials={initials} />
        </div>
      </header>

      {/* Content */}
      <main style={{ flex: 1, maxWidth: 680, width: "100%", margin: "0 auto", padding: "48px 24px" }}>
        {/* Page header */}
        <div style={{ marginBottom: 32 }}>
          <Link href="/" style={{ fontSize: 12, color: "var(--text-3)", fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 4, marginBottom: 20 }}>
            ← Back to apps
          </Link>
          <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.04em" }}>Settings</h1>
        </div>

        {/* Settings nav tabs */}
        <div style={{ display: "flex", gap: 2, borderBottom: "1px solid var(--border)", marginBottom: 32 }}>
          {SettingsNav.map(n => (
            <Link key={n.href} href={n.href} style={{
              fontSize: 13, fontWeight: 600, padding: "10px 16px",
              color: n.href === "/settings" ? "var(--text-1)" : "var(--text-3)",
              borderBottom: n.href === "/settings" ? "2px solid var(--brand)" : "2px solid transparent",
              textDecoration: "none", marginBottom: -1,
            }}>
              {n.label}
            </Link>
          ))}
        </div>

        {/* Profile card */}
        <div style={{ background: "var(--surface-1)", border: "1px solid var(--border-med)", borderRadius: 16, overflow: "hidden" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)" }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-1)" }}>Profile</h2>
            <p style={{ fontSize: 12, color: "var(--text-3)", marginTop: 2 }}>Your public profile information.</p>
          </div>

          {/* Avatar row */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "20px 24px", borderBottom: "1px solid var(--border)" }}>
            <div style={{
              width: 56, height: 56, borderRadius: "50%",
              background: "linear-gradient(135deg, #7260fb, #4f3dd4)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, fontWeight: 800, color: "#fff", flexShrink: 0,
            }}>
              {initials}
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>{session.name}</div>
              <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 2 }}>{session.email}</div>
            </div>
          </div>

          {/* Fields */}
          {[
            { label: "Full name",  value: session.name  },
            { label: "Email",      value: session.email },
          ].map(f => (
            <div key={f.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", borderBottom: "1px solid var(--border)", gap: 16 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-3)", marginBottom: 2 }}>{f.label}</div>
                <div style={{ fontSize: 14, color: "var(--text-1)" }}>{f.value}</div>
              </div>
            </div>
          ))}

          {/* Footer note */}
          <div style={{ padding: "14px 24px" }}>
            <p style={{ fontSize: 12, color: "var(--text-3)" }}>
              To change your name or email, contact{" "}
              <a href="mailto:support@byund.com" style={{ color: "var(--brand-hi)" }}>support@byund.com</a>.
            </p>
          </div>
        </div>

        {/* Danger zone */}
        <div style={{ marginTop: 28, background: "var(--surface-1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 16 }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(239,68,68,0.12)" }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: "#ef4444" }}>Danger Zone</h2>
          </div>
          <div style={{ padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>Change password</div>
              <div style={{ fontSize: 12, color: "var(--text-3)" }}>Update your account password.</div>
            </div>
            <Link href="/settings/security" style={{
              fontSize: 12, fontWeight: 600, padding: "8px 16px", borderRadius: 8,
              border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444",
              textDecoration: "none", whiteSpace: "nowrap",
              transition: "background 0.12s",
            }}>
              Change password →
            </Link>
          </div>
        </div>
      </main>

      <footer style={{ borderTop: "1px solid var(--border)", padding: "16px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
        <p style={{ fontSize: 11, color: "var(--text-3)" }}>© {new Date().getFullYear()} NIPPYSKY LIMITED</p>
        <div style={{ display: "flex", gap: 16 }}>
          {[["https://byund.com/privacy","Privacy"],["https://byund.com/terms","Terms"]].map(([h,l]) => (
            <Link key={h} href={h} style={{ fontSize: 11, color: "var(--text-3)" }}>{l}</Link>
          ))}
        </div>
      </footer>
    </div>
  );
}
