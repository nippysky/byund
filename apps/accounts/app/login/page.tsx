"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

function LoginForm() {
  const router       = useRouter();
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

    if (!res.ok) {
      setError(data.error ?? "Login failed");
      setLoading(false);
      return;
    }

    // Server computed a safe redirect URL (includes ?_token for cross-domain)
    window.location.href = data.redirectTo;
  };

  return (
    <div style={{ width: "100%", maxWidth: 420 }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        {/* BYUND Logo */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <svg width={44} height={44} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="200" height="200" rx="44" fill="url(#acc-login-g)" />
            <defs>
              <linearGradient id="acc-login-g" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
                <stop stopColor="#b8acfe" /><stop offset="1" stopColor="#4f3dd4" />
              </linearGradient>
            </defs>
            <path opacity=".93" fillRule="evenodd" clipRule="evenodd"
              d="M62 52h46c20 0 34 12 34 30 0 10-5 19-13 24 11 5 18 15 18 28 0 20-15 34-37 34H62V52Zm28 50h16c7 0 12-5 12-12s-5-12-12-12H90v24Zm0 46h18c9 0 14-5 14-13s-5-14-14-14H90v27Z"
              fill="#fff" />
          </svg>
        </div>

        <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.22em", color: "var(--brand)", marginBottom: 4 }}>
          BYUND
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.04em", color: "var(--text-1)", marginBottom: 8, lineHeight: 1.2 }}>
          Sign in to your account
        </h1>
        <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>
          One account for all BYUND products
        </p>
      </div>

      <div style={{
        background: "var(--surface-1)",
        border: "1px solid var(--border-med)",
        borderRadius: 18,
        padding: "32px",
        boxShadow: "0 8px 48px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)",
      }}>
        <form onSubmit={handleLogin}>
          {error && (
            <div style={{
              background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.28)",
              borderRadius: 10, padding: "10px 14px", marginBottom: 20,
              color: "#ef4444", fontSize: 13, fontWeight: 500,
            }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: 18 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-1)", marginBottom: 7 }}>
              Email
            </label>
            <div style={{ position: "relative" }}>
              <Mail size={15} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
              <input
                type="email" required value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@company.com"
                style={{
                  width: "100%", padding: "11px 14px 11px 40px",
                  borderRadius: 10, border: "1px solid var(--border-med)",
                  background: "var(--surface-2)", color: "var(--text-1)",
                  fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit",
                }}
                onFocus={e => (e.target.style.borderColor = "var(--brand)")}
                onBlur={e => (e.target.style.borderColor = "var(--border-med)")}
              />
            </div>
          </div>

          <div style={{ marginBottom: 28 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-1)", marginBottom: 7 }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <Lock size={15} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
              <input
                type={showPw ? "text" : "password"} required value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••"
                style={{
                  width: "100%", padding: "11px 42px 11px 40px",
                  borderRadius: 10, border: "1px solid var(--border-med)",
                  background: "var(--surface-2)", color: "var(--text-1)",
                  fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit",
                }}
                onFocus={e => (e.target.style.borderColor = "var(--brand)")}
                onBlur={e => (e.target.style.borderColor = "var(--border-med)")}
              />
              <button type="button" onClick={() => setShowPw(!showPw)}
                style={{ position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 0, display: "flex" }}>
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button
            type="submit" disabled={loading}
            style={{
              width: "100%", padding: "13px 20px", borderRadius: 10, border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              background: "var(--brand)", color: "#fff",
              fontSize: 15, fontWeight: 700, letterSpacing: "-0.01em",
              opacity: loading ? 0.65 : 1, transition: "opacity 0.15s",
              boxShadow: "0 4px 20px rgba(114,96,251,0.4)", fontFamily: "inherit",
            }}
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>

      <p style={{ textAlign: "center", marginTop: 22, fontSize: 14, color: "var(--text-muted)" }}>
        No account?{" "}
        <Link
          href={next ? `/register?next=${encodeURIComponent(next)}` : "/register"}
          style={{ color: "var(--brand-hi)", fontWeight: 600, textDecoration: "none" }}
        >
          Create workspace
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      background: "var(--bg)", position: "relative", overflow: "hidden",
    }}>
      {/* Background glow */}
      <div style={{
        position: "absolute", width: 700, height: 700,
        top: "50%", left: "50%", transform: "translate(-50%, -60%)",
        background: "radial-gradient(ellipse, rgba(114,96,251,0.14) 0%, transparent 68%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
      }} />

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 24px 56px", position: "relative", zIndex: 1 }}>
        <Suspense fallback={<div style={{ width: 420, height: 400, background: "var(--surface-1)", borderRadius: 18, border: "1px solid var(--border-med)" }} />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
