"use client";
import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Building2, Mail, Lock, User, ShieldCheck, Layers, Activity, Sun, Moon } from "lucide-react";

function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  useEffect(() => {
    const stored = localStorage.getItem("byund-theme") as "dark" | "light" | null;
    const sys = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    setTheme(stored ?? sys);
  }, []);
  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("byund-theme", next);
  };
  return (
    <button onClick={toggle} title="Toggle theme"
      style={{ width: 36, height: 36, borderRadius: 9, background: "var(--surface-2)", border: "1px solid var(--border-med)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-2)", cursor: "pointer", flexShrink: 0 }}>
      {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
    </button>
  );
}

function Mark({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" rx="44" fill="url(#byund-reg-g)" />
      <defs><linearGradient id="byund-reg-g" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse"><stop stopColor="#b8acfe" /><stop offset="1" stopColor="#4f3dd4" /></linearGradient></defs>
      <path opacity=".93" fillRule="evenodd" clipRule="evenodd" d="M62 52h46c20 0 34 12 34 30 0 10-5 19-13 24 11 5 18 15 18 28 0 20-15 34-37 34H62V52Zm28 50h16c7 0 12-5 12-12s-5-12-12-12H90v24Zm0 46h18c9 0 14-5 14-13s-5-14-14-14H90v27Z" fill="#fff" />
    </svg>
  );
}

const BENEFITS = [
  "One account across all BYUND products",
  "Free during early access",
  "Asset governance up in 5 minutes",
  "No credit card required",
  "Full audit trail from day one",
  "Direct input into the product roadmap",
];

function RegisterForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "";
  const [form, setForm] = useState({ name: "", email: "", password: "", workspaceName: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 8) { setError("Password must be at least 8 characters"); return; }
    setLoading(true); setError("");
    const res  = await fetch("/api/auth/register", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, next }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error ?? "Registration failed"); setLoading(false); return; }
    window.location.href = data.redirectTo;
  };

  const inp = (extra?: object) => ({
    borderRadius: 11, border: "1.5px solid var(--border-med)",
    background: "var(--surface-2)", color: "var(--text-1)",
    fontSize: 14, outline: "none", boxSizing: "border-box" as const,
    fontFamily: "inherit", width: "100%", ...extra,
  });

  const fields = [
    { key: "name"          as const, label: "Full Name",      Icon: User,      type: "text",     placeholder: "Your Name",       autoComplete: "name" },
    { key: "email"         as const, label: "Work Email",     Icon: Mail,      type: "email",    placeholder: "you@company.com", autoComplete: "email" },
    { key: "password"      as const, label: "Password",       Icon: Lock,      type: "password", placeholder: "Min. 8 characters", autoComplete: "new-password" },
    { key: "workspaceName" as const, label: "Workspace Name", Icon: Building2, type: "text",     placeholder: "My Company",      autoComplete: "organization" },
  ];

  return (
    <div style={{ width: "100%", maxWidth: 400 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.04em", color: "var(--text-1)", marginBottom: 8, lineHeight: 1.15 }}>
          Create your account
        </h1>
        <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.65 }}>
          One BYUND account. Every product. Free to start.
        </p>
      </div>

      <div style={{
        background: "var(--surface-1)", border: "1.5px solid var(--border-med)",
        borderRadius: 20, padding: "32px",
        boxShadow: "0 8px 48px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.04)",
      }}>
        <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {error && (
            <div style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 10, padding: "11px 14px", color: "#ef4444", fontSize: 13, fontWeight: 500 }}>
              {error}
            </div>
          )}
          {fields.map(({ key, label, Icon, type, placeholder, autoComplete }) => (
            <div key={key}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-1)", marginBottom: 7 }}>{label}</label>
              <div style={{ position: "relative" }}>
                <Icon size={15} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
                <input
                  type={type} required value={form[key]}
                  onChange={set(key)} placeholder={placeholder} autoComplete={autoComplete}
                  style={{ ...inp({ padding: "11px 14px 11px 40px" }) }}
                  onFocus={e => (e.target.style.borderColor = "var(--brand)")}
                  onBlur={e => (e.target.style.borderColor = "var(--border-med)")}
                />
              </div>
            </div>
          ))}
          <button type="submit" disabled={loading}
            style={{
              width: "100%", padding: "13px 20px", borderRadius: 11, border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              background: "var(--brand)", color: "#fff",
              fontSize: 15, fontWeight: 700, letterSpacing: "-0.01em",
              opacity: loading ? 0.6 : 1, transition: "opacity 0.15s",
              boxShadow: "0 4px 24px rgba(114,96,251,0.38)", fontFamily: "inherit", marginTop: 4,
            }}>
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </form>
      </div>

      <p style={{ textAlign: "center", marginTop: 22, fontSize: 14, color: "var(--text-muted)" }}>
        Already have an account?{" "}
        <Link href={next ? `/login?next=${encodeURIComponent(next)}` : "/login"}
          style={{ color: "var(--brand-hi)", fontWeight: 600, textDecoration: "none" }}>
          Sign in
        </Link>
      </p>
    </div>
  );
}

function BrandPanel() {
  return (
    <div style={{
      flex: "0 0 42%", display: "none", flexDirection: "column", justifyContent: "space-between",
      padding: "48px 52px", background: "var(--bg-elevated)",
      borderRight: "1.5px solid var(--border-med)", position: "relative", overflow: "hidden",
    }} className="acc-left">
      <div style={{ position: "absolute", top: -80, right: -80, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(114,96,251,0.13) 0%, transparent 65%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "linear-gradient(rgba(255,255,255,0.022) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.022) 1px,transparent 1px)", backgroundSize: "48px 48px", maskImage: "radial-gradient(ellipse 100% 60% at 50% 50%, black 30%, transparent 100%)" }} />

      <Link href="https://byund.com" style={{ display: "inline-flex", alignItems: "center", gap: 10, position: "relative" }}>
        <Mark size={32} />
        <div>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.18em", color: "var(--brand)", lineHeight: 1 }}>BYUND</div>
          <div style={{ fontSize: 8.5, fontWeight: 600, letterSpacing: "0.2em", color: "var(--text-muted)", marginTop: 2, lineHeight: 1 }}>ACCOUNTS</div>
        </div>
      </Link>

      <div style={{ position: "relative" }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: "var(--brand-hi)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 18 }}>Free during early access</p>
        <h2 style={{ fontSize: "clamp(26px,2.6vw,36px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.1, marginBottom: 18, color: "var(--text-1)" }}>
          Everything you need<br />to govern your stack.
        </h2>
        <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.8, marginBottom: 36, maxWidth: 300 }}>
          Create one BYUND account and get access to Governance, and every product we ship going forward.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
          {BENEFITS.map(b => (
            <div key={b} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 18, height: 18, borderRadius: 5, background: "rgba(114,96,251,0.18)", border: "1px solid rgba(114,96,251,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--brand-hi)" }} />
              </div>
              <span style={{ fontSize: 13, color: "var(--text-2)" }}>{b}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ fontSize: 11, color: "var(--text-3)" }}>© {new Date().getFullYear()} NIPPYSKY LIMITED</p>
        <div style={{ display: "flex", gap: 14 }}>
          <Link href="https://byund.com/privacy" style={{ fontSize: 11, color: "var(--text-3)", textDecoration: "none" }}>Privacy</Link>
          <Link href="https://byund.com/terms"   style={{ fontSize: 11, color: "var(--text-3)", textDecoration: "none" }}>Terms</Link>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div style={{ minHeight: "100dvh", display: "flex", background: "var(--bg)", color: "var(--text-1)" }}>
      <BrandPanel />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 28px" }}>
          <Link href="https://byund.com" className="acc-mobile-logo" style={{ display: "inline-flex", alignItems: "center", gap: 9 }}>
            <Mark size={28} />
            <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.16em", color: "var(--brand)" }}>BYUND</span>
          </Link>
          <div style={{ flex: 1 }} />
          <ThemeToggle />
        </div>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px 28px 48px" }}>
          <Suspense fallback={<div style={{ width: 400, height: 460, background: "var(--surface-1)", borderRadius: 20, border: "1.5px solid var(--border-med)" }} />}>
            <RegisterForm />
          </Suspense>
        </div>
        <div style={{ textAlign: "center", padding: "0 24px 24px", display: "flex", justifyContent: "center", gap: 20 }}>
          {[["https://byund.com/privacy", "Privacy"], ["https://byund.com/terms", "Terms"], ["https://byund.com/security", "Security"]].map(([href, label]) => (
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
