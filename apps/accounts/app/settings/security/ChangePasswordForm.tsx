"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock, CheckCircle } from "lucide-react";

export function ChangePasswordForm() {
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [show, setShow] = useState({ current: false, next: false, confirm: false });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState(false);

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));

  const toggleShow = (k: keyof typeof show) =>
    setShow(s => ({ ...s, [k]: !s[k] }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.next.length < 8) { setError("New password must be at least 8 characters."); return; }
    if (form.next !== form.confirm) { setError("New passwords don't match."); return; }

    setLoading(true);
    try {
      const res  = await fetch("/api/user/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: form.current, newPassword: form.next }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Failed to change password.");
        return;
      }
      setSuccess(true);
      setForm({ current: "", next: "", confirm: "" });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inp: React.CSSProperties = {
    width: "100%", padding: "11px 44px 11px 40px",
    borderRadius: 11, border: "1.5px solid var(--border-med)",
    background: "var(--surface-2)", color: "var(--text-1)",
    fontSize: 14, outline: "none", boxSizing: "border-box",
    fontFamily: "inherit",
  };

  const fields = [
    { key: "current" as const, label: "Current password",  placeholder: "Your current password"  },
    { key: "next"    as const, label: "New password",       placeholder: "Min. 8 characters"       },
    { key: "confirm" as const, label: "Confirm new password", placeholder: "Repeat new password"  },
  ];

  return (
    <div style={{ background: "var(--surface-1)", border: "1px solid var(--border-med)", borderRadius: 16, overflow: "hidden" }}>
      <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)" }}>
        <h2 style={{ fontSize: 14, fontWeight: 700 }}>Change Password</h2>
        <p style={{ fontSize: 12, color: "var(--text-3)", marginTop: 2 }}>
          Use a strong password you don{"'"}t use elsewhere.
        </p>
      </div>

      {success ? (
        <div style={{ padding: "32px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, textAlign: "center" }}>
          <CheckCircle size={32} color="#10b981" />
          <div style={{ fontSize: 15, fontWeight: 700 }}>Password changed</div>
          <div style={{ fontSize: 13, color: "var(--text-3)" }}>Your password has been updated successfully.</div>
          <button
            onClick={() => setSuccess(false)}
            style={{
              marginTop: 8, fontSize: 13, fontWeight: 600, color: "var(--brand-hi)",
              background: "none", border: "none", cursor: "pointer", padding: 0,
            }}
          >
            Change again
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ padding: "24px" }}>
          {error && (
            <div style={{
              background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.25)",
              borderRadius: 10, padding: "11px 14px", color: "#ef4444",
              fontSize: 13, fontWeight: 500, marginBottom: 20,
            }}>
              {error}
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {fields.map(({ key, label, placeholder }) => (
              <div key={key}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-2)", marginBottom: 7 }}>
                  {label}
                </label>
                <div style={{ position: "relative" }}>
                  <Lock size={14} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "var(--text-3)", pointerEvents: "none" }} />
                  <input
                    type={show[key] ? "text" : "password"}
                    required
                    value={form[key]}
                    onChange={set(key)}
                    placeholder={placeholder}
                    style={inp}
                    onFocus={e => (e.target.style.borderColor = "var(--brand)")}
                    onBlur={e  => (e.target.style.borderColor = "var(--border-med)")}
                  />
                  <button
                    type="button"
                    onClick={() => toggleShow(key)}
                    style={{ position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-3)", padding: 0, display: "flex" }}
                  >
                    {show[key] ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 24, width: "100%", padding: "12px 20px",
              borderRadius: 11, border: "none", cursor: loading ? "not-allowed" : "pointer",
              background: "var(--brand)", color: "#fff",
              fontSize: 14, fontWeight: 700, letterSpacing: "-0.01em",
              opacity: loading ? 0.6 : 1, transition: "opacity 0.15s",
              boxShadow: "0 4px 20px rgba(114,96,251,0.3)", fontFamily: "inherit",
            }}
          >
            {loading ? "Updating…" : "Update Password"}
          </button>
        </form>
      )}
    </div>
  );
}
