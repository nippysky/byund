"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Building2, Mail, Lock, User } from "lucide-react";
import Logo from "@/components/ui/Logo";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function RegisterPage() {
  const router = useRouter();
  const [form,    setForm]    = useState({ name: "", email: "", password: "", workspaceName: "" });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 8) { setError("Password must be at least 8 characters"); return; }
    setLoading(true);
    setError("");

    const res  = await fetch("/api/auth/register", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(form),
    });
    const data = await res.json();

    if (!res.ok) { setError(data.error ?? "Registration failed"); setLoading(false); return; }
    router.push("/");
  };

  const fields = [
    { key: "name"          as const, label: "Full Name",      Icon: User,      type: "text",     placeholder: "Chukwudubem Femi" },
    { key: "email"         as const, label: "Work Email",     Icon: Mail,      type: "email",    placeholder: "you@company.com"  },
    { key: "password"      as const, label: "Password",       Icon: Lock,      type: "password", placeholder: "Min. 8 characters" },
    { key: "workspaceName" as const, label: "Workspace Name", Icon: Building2, type: "text",     placeholder: "NIPPYSKY LIMITED" },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg)", position: "relative", overflow: "hidden" }}>

      {/* Background glow — matches marketing site */}
      <div style={{
        position: "absolute", width: 700, height: 700,
        top: "50%", left: "50%", transform: "translate(-50%, -55%)",
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
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px 24px 56px", position: "relative", zIndex: 1 }}>
        <div style={{ width: "100%", maxWidth: 440 }}>

          <div style={{ textAlign: "center", marginBottom: 30 }}>
            <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.04em", color: "var(--text-1)", marginBottom: 8, lineHeight: 1.2 }}>
              Create your workspace
            </h1>
            <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.6 }}>
              Set up BYUND Governance for your team — free to start
            </p>
          </div>

          <div style={{
            background: "var(--surface-1)",
            border: "1px solid var(--border-med)",
            borderRadius: 18,
            padding: "32px",
            boxShadow: "0 8px 48px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)",
          }}>
            <form onSubmit={handleRegister}>
              {error && (
                <div style={{
                  background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.28)",
                  borderRadius: 10, padding: "10px 14px", marginBottom: 20,
                  color: "#ef4444", fontSize: 13, fontWeight: 500,
                }}>
                  {error}
                </div>
              )}

              {fields.map(({ key, label, Icon, type, placeholder }) => (
                <div key={key} style={{ marginBottom: 18 }}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-1)", marginBottom: 7 }}>
                    {label}
                  </label>
                  <div style={{ position: "relative" }}>
                    <Icon size={15} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
                    <input
                      type={type} required
                      value={form[key]}
                      onChange={set(key)}
                      placeholder={placeholder}
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
              ))}

              <button
                type="submit" disabled={loading}
                style={{
                  width: "100%", padding: "13px 20px", marginTop: 8,
                  borderRadius: 10, border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  background: "var(--brand)", color: "#fff",
                  fontSize: 15, fontWeight: 700, letterSpacing: "-0.01em",
                  opacity: loading ? 0.65 : 1, transition: "opacity 0.15s",
                  boxShadow: "0 4px 20px rgba(114,96,251,0.4)", fontFamily: "inherit",
                }}
              >
                {loading ? "Creating workspace…" : "Create Workspace"}
              </button>
            </form>
          </div>

          <p style={{ textAlign: "center", marginTop: 22, fontSize: 14, color: "var(--text-muted)" }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "var(--brand-hi)", fontWeight: 600, textDecoration: "none" }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
