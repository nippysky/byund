import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

/**
 * Root page — if logged in, show account portal; if not, go to /login.
 * As we add more BYUND products, this becomes a product picker / account portal.
 */
export default async function HomePage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  // Logged in — show simple account portal
  const defaultApp = process.env.NEXT_PUBLIC_DEFAULT_APP_URL ?? "#";

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)" }}>
      <div style={{ textAlign: "center", maxWidth: 480, padding: "0 24px" }}>
        <div style={{ marginBottom: 24 }}>
          {/* BYUND logo */}
          <svg width={48} height={48} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ margin: "0 auto 16px", display: "block" }}>
            <rect width="200" height="200" rx="44" fill="url(#logo-g)" />
            <defs>
              <linearGradient id="logo-g" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
                <stop stopColor="#b8acfe" />
                <stop offset="1" stopColor="#4f3dd4" />
              </linearGradient>
            </defs>
            <path opacity=".93" fillRule="evenodd" clipRule="evenodd" d="M62 52h46c20 0 34 12 34 30 0 10-5 19-13 24 11 5 18 15 18 28 0 20-15 34-37 34H62V52Zm28 50h16c7 0 12-5 12-12s-5-12-12-12H90v24Zm0 46h18c9 0 14-5 14-13s-5-14-14-14H90v27Z" fill="#fff" />
          </svg>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-1)", letterSpacing: "-0.03em", marginBottom: 6 }}>
            BYUND Account
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
            Signed in as <strong style={{ color: "var(--text-1)" }}>{session.email}</strong>
          </p>
        </div>

        {/* Product links */}
        <div style={{ display: "grid", gap: 12, marginBottom: 24 }}>
          <a href={defaultApp} style={{
            display: "block", padding: "16px 20px", background: "var(--surface-1)",
            border: "1px solid var(--border-med)", borderRadius: 14,
            color: "var(--text-1)", fontSize: 14, fontWeight: 600,
            transition: "border-color 0.15s",
          }}>
            <div style={{ fontWeight: 700, marginBottom: 3 }}>Governance</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Asset ownership, reviews &amp; audit compliance</div>
          </a>
          {/* More products appear here as BYUND grows */}
        </div>

        <form action="/api/auth/logout" method="POST">
          <button type="submit" style={{
            padding: "9px 20px", borderRadius: 9,
            background: "transparent", border: "1px solid var(--border-med)",
            color: "var(--text-muted)", fontSize: 13, fontWeight: 600,
            cursor: "pointer",
          }}>
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}
