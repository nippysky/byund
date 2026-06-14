import Link from "next/link";
import { ShieldCheck, Server, Activity } from "lucide-react";
import { SignInForm } from "./SignInForm";

type SearchParams = Record<string, string | string[] | undefined>;

function safeNextPath(raw: unknown) {
  if (typeof raw !== "string" || !raw) return "/dashboard";
  if (!raw.startsWith("/")) return "/dashboard";
  if (raw.startsWith("//")) return "/dashboard";
  return raw;
}

function Mark() {
  return (
    <svg width="30" height="30" viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="9" fill="url(#si-g)" />
      <path d="M9 9h6.5a4.5 4.5 0 0 1 0 9H9V9Z" fill="white" fillOpacity="0.95" />
      <path d="M9 18h7.5a4.5 4.5 0 0 1 0 9H9v-9Z" fill="white" fillOpacity="0.45" />
      <defs>
        <linearGradient id="si-g" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#a496fd" /><stop offset="1" stopColor="#4f3dd4" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default async function SignInPage({
  searchParams,
}: {
  searchParams?: SearchParams | Promise<SearchParams>;
}) {
  const sp = (await searchParams) ?? {};
  const rawNext = sp.next;
  const nextPath = safeNextPath(Array.isArray(rawNext) ? rawNext[0] : rawNext);

  return (
    <div style={{ minHeight: "100dvh", display: "flex", background: "var(--bg)", color: "var(--text-1)" }}>
      {/* Left — brand panel (desktop only) */}
      <div style={{
        flex: "0 0 44%", display: "none", flexDirection: "column", justifyContent: "space-between",
        padding: "48px 56px", background: "var(--bg-elevated)",
        borderRight: "1px solid var(--border)", position: "relative", overflow: "hidden",
      }} className="auth-left">
        <div style={{
          position: "absolute", bottom: "-120px", left: "-80px",
          width: "480px", height: "480px", borderRadius: "50%",
          background: "radial-gradient(circle, var(--brand-sub) 0%, transparent 65%)", pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", top: 0, insetInline: 0, height: "100%",
          backgroundImage: "linear-gradient(rgba(255,255,255,0.022) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.022) 1px,transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse 100% 50% at 50% 0%,black 20%,transparent 100%)",
          pointerEvents: "none",
        }} />

        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "10px", position: "relative" }}>
          <Mark />
          <span style={{ fontSize: "18px", fontWeight: 800, letterSpacing: "-0.045em" }}>BYUND</span>
        </Link>

        <div style={{ position: "relative" }}>
          <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--brand-hi)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "20px" }}>
            One account. All products.
          </p>
          <h2 style={{ fontSize: "clamp(26px,3vw,38px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.1, marginBottom: "20px" }}>
            Your BYUND account<br />works everywhere.
          </h2>
          <p style={{ fontSize: "15px", color: "var(--text-2)", lineHeight: 1.75, marginBottom: "40px", maxWidth: "340px" }}>
            Sign in once to access every BYUND product — just like one Google account works across Gmail, Drive, and Docs.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {[
              { icon: <ShieldCheck size={15} />, text: "BYUND Governance — Asset & audit management" },
              { icon: <Server size={15} />,      text: "9 infrastructure asset types supported"       },
              { icon: <Activity size={15} />,    text: "Full immutable audit trail on every action"   },
            ].map(item => (
              <div key={item.text} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                  width: "30px", height: "30px", borderRadius: "8px",
                  background: "var(--brand-sub2)", border: "1px solid rgba(114,96,251,0.25)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--brand-hi)", flexShrink: 0,
                }}>{item.icon}</div>
                <span style={{ fontSize: "13px", color: "var(--text-2)" }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ fontSize: "12px", color: "var(--text-3)" }}>© {new Date().getFullYear()} NIPPYSKY LIMITED</p>
          <div style={{ display: "flex", gap: "16px" }}>
            <Link href="/privacy" style={{ fontSize: "12px", color: "var(--text-3)" }}>Privacy</Link>
            <Link href="/terms" style={{ fontSize: "12px", color: "var(--text-3)" }}>Terms</Link>
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div className="auth-mobile-logo" style={{ marginBottom: "48px" }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "9px" }}>
            <Mark />
            <span style={{ fontSize: "18px", fontWeight: 800, letterSpacing: "-0.045em" }}>BYUND</span>
          </Link>
        </div>

        <div style={{ width: "100%", maxWidth: "420px" }}>
          <div style={{ marginBottom: "32px" }}>
            <h1 style={{ fontSize: "26px", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: "8px" }}>Welcome back</h1>
            <p style={{ fontSize: "15px", color: "var(--text-3)", lineHeight: 1.6 }}>
              Sign in to your BYUND account to continue.
            </p>
          </div>

          <div style={{ background: "var(--surface-1)", border: "1px solid var(--border-med)", borderRadius: "20px", padding: "32px" }}>
            <SignInForm nextPath={nextPath} />
          </div>

          <div style={{ marginTop: "28px", display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap" }}>
            {["/privacy", "/terms", "/security"].map((href, i) => (
              <Link key={href} href={href} style={{ fontSize: "12px", color: "var(--text-3)" }}>
                {["Privacy", "Terms", "Security"][i]}
              </Link>
            ))}
          </div>
          <p style={{ textAlign: "center", fontSize: "12px", color: "var(--text-3)", marginTop: "10px" }}>
            © {new Date().getFullYear()} NIPPYSKY LIMITED
          </p>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .auth-left { display: flex !important; }
          .auth-mobile-logo { display: none !important; }
        }
      `}</style>
    </div>
  );
}
