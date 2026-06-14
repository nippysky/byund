"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail, Zap } from "lucide-react";
import Logo from "@/components/ui/Logo";
import ThemeToggle from "@/components/ui/ThemeToggle";

const DEV_EMAIL    = process.env.NEXT_PUBLIC_DEV_ADMIN_EMAIL    ?? "";
const DEV_PASSWORD = process.env.NEXT_PUBLIC_DEV_ADMIN_PASSWORD ?? "";
const IS_DEV       = process.env.NODE_ENV === "development";

export default function LoginPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();

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
      body:    JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Login failed");
      setLoading(false);
      return;
    }

    router.push(searchParams.get("from") ?? "/");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg)", position: "relative", overflow: "hidden" }}>

      {/* Background glow — matches marketing site */}
      <div style={{
        position: "absolute", width: 700, height: 700,
        top: "50%", left: "50%", transform: "translate(-50%, -60%)",
        background: "radial-gradient(ellipse, rgba(114,96,251,0.16) 0%, transparent 68%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
      }} />

      {/* Top nav */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 28px", position: "relative", zIndex: 1 }}>
        <Logo size={30} withProduct showText />
        <ThemeToggle />
      </div>

      {/* Form area */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 24px 56px", position: "relative", zIndex: 1 }}>
        <div style={{ width: "100%", maxWidth: 420 }}>

          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.04em", color: "var(--text-1)", marginBottom: 8, lineHeight: 1.2 }}>
              Sign in
            </h1>
            <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.6 }}>
              Welcome back — sign in to your workspace
            </p>
          </div>

          {/* Dev autofill — only visible in development when env vars are set */}
          {IS_DEV && DEV_EMAIL && (
            <button
              type="button"
              onClick={() => { setEmail(DEV_EMAIL); setPassword(DEV_PASSWORD); }}
              style={{
                display: "flex", alignItems: "center", gap: 7, width: "100%",
                marginBottom: 14, padding: "9px 14px", borderRadius: 10,
                background: "rgba(114,96,251,0.08)", border: "1px dashed rgba(114,96,251,0.35)",
                color: "var(--brand-hi)", fontSize: 13, fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit", letterSpacing: "-0.01em",
              }}
            >
              <Zap size={13} />
              Dev: fill admin credentials
            </button>
          )}

          {/* Card */}
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
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-1)", marginBottom: 7 }}>Email</label>
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
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-1)", marginBottom: 7 }}>Password</label>
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
            <Link href="/register" style={{ color: "var(--brand-hi)", fontWeight: 600, textDecoration: "none" }}>
              Create workspace
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
