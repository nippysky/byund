"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail, Zap } from "lucide-react";

// ── BYUND logo mark ───────────────────────────────────────────────────────────
function Mark({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none">
      <rect width="200" height="200" rx="44" fill="url(#byund-acc-g)" />
      <defs>
        <linearGradient id="byund-acc-g" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
          <stop stopColor="#b8acfe" /><stop offset="1" stopColor="#4f3dd4" />
        </linearGradient>
      </defs>
      <path opacity=".93" fillRule="evenodd" clipRule="evenodd"
        d="M62 52h46c20 0 34 12 34 30 0 10-5 19-13 24 11 5 18 15 18 28 0 20-15 34-37 34H62V52Zm28 50h16c7 0 12-5 12-12s-5-12-12-12H90v24Zm0 46h18c9 0 14-5 14-13s-5-14-14-14H90v27Z"
        fill="#fff" />
    </svg>
  );
}

// ── Login form ────────────────────────────────────────────────────────────────
const DEV_EMAIL    = process.env.NEXT_PUBLIC_DEV_ADMIN_EMAIL    ?? "";
const DEV_PASSWORD = process.env.NEXT_PUBLIC_DEV_ADMIN_PASSWORD ?? "";
const IS_DEV       = process.env.NODE_ENV === "development";

function LoginForm() {
  const searchParams = useSearchParams();
  const next         = searchParams.get("next") ?? "";

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res  = await fetch("/api/auth/login", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ email, password, next }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error ?? "Login failed"); setLoading(false); return; }
    window.location.href = data.redirectTo;
  };

  const inp = (extra?: object) => ({
    borderRadius: 11, border: "1.5px solid var(--border-med)",
    background: "var(--surface-2)", color: "var(--text-1)",
    fontSize: 14, outline: "none", boxSizing: "border-box" as const,
    fontFamily: "inherit", width: "100%", ...extra,
  });

  return (
    <div style={{ width: "100%", maxWidth: 400 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.04em", color: "var(--text-1)", marginBottom: 8, lineHeight: 1.15 }}>
          Welcome back
        </h1>
        <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.65 }}>
          Sign in to your BYUND account to continue.
        </p>
      </div>

      {IS_DEV && DEV_EMAIL && (
        <button type="button"
          onClick={() => { setEmail(DEV_EMAIL); setPassword(DEV_PASSWORD); }}
          style={{
            display: "flex", alignItems: "center", gap: 8, width: "100%",
            marginBottom: 18, padding: "10px 14px", borderRadius: 10,
            background: "rgba(114,96,251,0.07)", border: "1px dashed rgba(114,96,251,0.3)",
            color: "var(--brand-hi)", fontSize: 13, fontWeight: 600,
            cursor: "pointer", fontFamily: "inherit",
          }}
        >
          <Zap size={13} /> Dev: autofill admin credentials
        </button>
      )}

      <div style={{ background: "var(--surface-1)", border: "1.5px solid var(--border-med)", borderRadius: 20, padding: "32px", boxShadow: "0 8px 48px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.04)" }}>
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {error && (
            <div style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 10, padding: "11px 14px", color: "#ef4444", fontSize: 13, fontWeight: 500 }}>
              {error}
            </div>
          )}
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-1)", marginBottom: 7 }}>Email address</label>
            <div style={{ position: "relative" }}>
              <Mail size={15} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
              <input type="email" required value={email} autoComplete="email" onChange={e => setEmail(e.target.value)}
                placeholder="you@company.com" style={{ ...inp({ padding: "11px 14px 11px 40px" }) }}
                onFocus={e => (e.target.style.borderColor = "var(--brand)")}
                onBlur={e => (e.target.style.borderColor = "var(--border-med)")} />
            </div>
          </div>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-1)", marginBottom: 7 }}>Password</label>
            <div style={{ position: "relative" }}>
              <Lock size={15} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
              <input type={showPw ? "text" : "password"} required value={password} autoComplete="current-password"
                onChange={e => setPassword(e.target.value)} placeholder="••••••••••"
                style={{ ...inp({ padding: "11px 44px 11px 40px" }) }}
                onFocus={e => (e.target.style.borderColor = "var(--brand)")}
                onBlur={e => (e.target.style.borderColor = "var(--border-med)")} />
              <button type="button" onClick={() => setShowPw(!showPw)}
                style={{ position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 0, display: "flex" }}>
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} style={{
            width: "100%", padding: "13px 20px", borderRadius: 11, border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            background: "var(--brand)", color: "#fff",
            fontSize: 15, fontWeight: 700, letterSpacing: "-0.01em",
            opacity: loading ? 0.6 : 1, transition: "opacity 0.15s",
            boxShadow: "0 4px 24px rgba(114,96,251,0.38)", fontFamily: "inherit", marginTop: 4,
          }}>
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>

      <p style={{ textAlign: "center", marginTop: 22, fontSize: 14, color: "var(--text-muted)" }}>
        No account?{" "}
        <Link href={next ? `/register?next=${encodeURIComponent(next)}` : "/register"}
          style={{ color: "var(--brand-hi)", fontWeight: 600, textDecoration: "none" }}>
          Create workspace
        </Link>
      </p>
    </div>
  );
}

// ── Left brand panel ──────────────────────────────────────────────────────────
function BrandPanel() {
  return (
    <div style={{ flex: "0 0 42%", display: "none", flexDirection: "column", justifyContent: "space-between", padding: "48px 52px", background: "var(--bg-elevated)", borderRight: "1.5px solid var(--border-med)", position: "relative", overflow: "hidden" }} className="acc-left">
      <div style={{ position: "absolute", bottom: -120, left: -80, width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle, rgba(114,96,251,0.14) 0%, transparent 65%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "linear-gradient(rgba(255,255,255,0.022) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.022) 1px,transparent 1px)", backgroundSize: "48px 48px", maskImage: "radial-gradient(ellipse 100% 60% at 50% 50%, black 30%, transparent 100%)" }} />
      <Link href="https://byund.com" style={{ display: "inline-flex", alignItems: "center", gap: 10, position: "relative" }}>
        <Mark size={32} />
        <div>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.18em", color: "var(--brand)", lineHeight: 1 }}>BYUND</div>
          <div style={{ fontSize: 8.5, fontWeight: 600, letterSpacing: "0.2em", color: "var(--text-muted)", marginTop: 2, lineHeight: 1 }}>ACCOUNTS</div>
        </div>
      </Link>
      <div style={{ position: "relative" }}>
        <h2 style={{ fontSize: "clamp(30px, 3vw, 46px)", fontWeight: 800, letterSpacing: "-0.045em", lineHeight: 1.08, marginBottom: 20, color: "var(--text-1)" }}>One account.</h2>
        <p style={{ fontSize: "clamp(18px, 2vw, 26px)", fontWeight: 300, letterSpacing: "-0.02em", color: "var(--text-muted)", lineHeight: 1.4, marginBottom: 48 }}>
          Sign in once,<br />access everything.
        </p>
        <div style={{ width: 40, height: 3, borderRadius: 99, background: "var(--brand)", marginBottom: 28, opacity: 0.7 }} />
        <p style={{ fontSize: 14, color: "var(--text-3)", lineHeight: 1.8, maxWidth: 300 }}>
          Your BYUND account works across every product we build — now and in the future.
        </p>
      </div>
      <div style={{ position: "relative" }}>
        <p style={{ fontSize: 11, color: "var(--text-3)" }}>© {new Date().getFullYear()} NIPPYSKY LIMITED</p>
      </div>
    </div>
  );
}

// ── Shell ─────────────────────────────────────────────────────────────────────
export default function LoginClientPage() {
  return (
    <div style={{ minHeight: "100dvh", display: "flex", background: "var(--bg)", color: "var(--text-1)" }}>
      <BrandPanel />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative" }}>
        {/* Mobile logo only */}
        <div style={{ display: "flex", alignItems: "center", padding: "20px 28px" }}>
          <Link href="https://byund.com" className="acc-mobile-logo" style={{ display: "inline-flex", alignItems: "center", gap: 9 }}>
            <Mark size={28} />
            <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.16em", color: "var(--brand)" }}>BYUND</span>
          </Link>
        </div>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px 28px 48px" }}>
          <Suspense fallback={<div style={{ width: 400, height: 380, background: "var(--surface-1)", borderRadius: 20, border: "1.5px solid var(--border-med)" }} />}>
            <LoginForm />
          </Suspense>
        </div>
        <div style={{ textAlign: "center", padding: "0 24px 24px", display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap" }}>
          {[["https://byund.com/privacy","Privacy"],["https://byund.com/terms","Terms"],["https://byund.com/security","Security"]].map(([href,label]) => (
            <Link key={href} href={href} style={{ fontSize: 12, color: "var(--text-3)", textDecoration: "none" }}>{label}</Link>
          ))}
        </div>
      </div>
      <style>{`
        @media (min-width: 768px) { .acc-left { display: flex !important; } .acc-mobile-logo { display: none !important; } }
      `}</style>
    </div>
  );
}
