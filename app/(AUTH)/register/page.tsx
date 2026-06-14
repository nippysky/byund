import Link from "next/link";
import { Check } from "lucide-react";
import { RegisterForm } from "./RegisterForm";

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
      <rect width="32" height="32" rx="9" fill="url(#reg-g)" />
      <path d="M9 9h6.5a4.5 4.5 0 0 1 0 9H9V9Z" fill="white" fillOpacity="0.95" />
      <path d="M9 18h7.5a4.5 4.5 0 0 1 0 9H9v-9Z" fill="white" fillOpacity="0.45" />
      <defs>
        <linearGradient id="reg-g" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#a496fd" /><stop offset="1" stopColor="#4f3dd4" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const BENEFITS = [
  "One account, all BYUND products",
  "Free during early access",
  "Register assets in under 5 minutes",
  "No credit card required",
  "Instant access to BYUND Governance",
  "Direct input into the product roadmap",
];

export default async function RegisterPage({
  searchParams,
}: {
  searchParams?: SearchParams | Promise<SearchParams>;
}) {
  const sp = (await searchParams) ?? {};
  const rawNext = sp.next;
  const nextPath = safeNextPath(Array.isArray(rawNext) ? rawNext[0] : rawNext);

  return (
    <div style={{ minHeight: "100dvh", display: "flex", background: "var(--bg)", color: "var(--text-1)" }}>
      {/* Left — brand */}
      <div style={{
        flex: "0 0 40%", display: "none", flexDirection: "column", justifyContent: "space-between",
        padding: "48px 56px", background: "var(--bg-elevated)",
        borderRight: "1px solid var(--border)", position: "relative", overflow: "hidden",
      }} className="auth-left">
        <div style={{
          position: "absolute", top: "-80px", right: "-80px",
          width: "400px", height: "400px", borderRadius: "50%",
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
          <h2 style={{ fontSize: "clamp(24px,2.8vw,36px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.1, marginBottom: "20px" }}>
            Start governing your<br />
            <span style={{
              background: "linear-gradient(135deg, var(--brand-hi) 0%, var(--brand) 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>infrastructure properly.</span>
          </h2>
          <p style={{ fontSize: "15px", color: "var(--text-2)", lineHeight: 1.75, marginBottom: "36px", maxWidth: "320px" }}>
            Join IT teams, MSPs, and fintechs using BYUND to track every asset, review cycle, and audit trail.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {BENEFITS.map(b => (
              <div key={b} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{
                  width: "20px", height: "20px", borderRadius: "50%", flexShrink: 0,
                  background: "var(--brand-sub2)", border: "1px solid rgba(114,96,251,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Check size={11} color="var(--brand-hi)" />
                </div>
                <span style={{ fontSize: "13px", color: "var(--text-2)" }}>{b}</span>
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
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", overflowY: "auto" }}>
        <div className="auth-mobile-logo" style={{ marginBottom: "40px" }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "9px" }}>
            <Mark />
            <span style={{ fontSize: "18px", fontWeight: 800, letterSpacing: "-0.045em" }}>BYUND</span>
          </Link>
        </div>

        <div style={{ width: "100%", maxWidth: "460px" }}>
          <div style={{ marginBottom: "28px" }}>
            <h1 style={{ fontSize: "26px", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: "8px" }}>Create your account</h1>
            <p style={{ fontSize: "15px", color: "var(--text-3)", lineHeight: 1.6 }}>
              Free during early access. No credit card required.
            </p>
          </div>

          <div style={{ background: "var(--surface-1)", border: "1px solid var(--border-med)", borderRadius: "20px", padding: "32px" }}>
            <RegisterForm nextPath={nextPath} />
          </div>

          <div style={{ marginTop: "24px", display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap" }}>
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
