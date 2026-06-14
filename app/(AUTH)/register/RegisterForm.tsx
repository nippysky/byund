"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, RefreshCw, Check } from "lucide-react";

const MIN = 8;

function reqs(pw: string) {
  return {
    len:     pw.length >= MIN,
    lower:   /[a-z]/.test(pw),
    upper:   /[A-Z]/.test(pw),
    number:  /[0-9]/.test(pw),
    special: /[^A-Za-z0-9]/.test(pw),
  };
}

function score(pw: string) {
  if (!pw) return 0;
  const r = reqs(pw);
  let s = 0;
  if (r.len) s++;
  if (r.lower && r.upper) s++;
  if (r.number && r.special) s++;
  return Math.min(s, 3);
}

function genPassword(len = 14) {
  const lo = "abcdefghijklmnopqrstuvwxyz";
  const up = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const nu = "0123456789";
  const sp = "!@#$%^&*()_+-=[]{}|;:,.<>?";
  const all = lo + up + nu + sp;
  let pw = lo[Math.floor(Math.random() * lo.length)] + up[Math.floor(Math.random() * up.length)] + nu[Math.floor(Math.random() * nu.length)] + sp[Math.floor(Math.random() * sp.length)];
  for (let i = pw.length; i < len; i++) pw += all[Math.floor(Math.random() * all.length)];
  return pw.split("").sort(() => Math.random() - 0.5).join("");
}

const schema = z.object({
  name:     z.string().min(1, "Enter your name.").max(80),
  email:    z.string().email("Enter a valid email address.").transform(s => s.toLowerCase().trim()),
  password: z.string().min(MIN, `At least ${MIN} characters.`).max(200)
    .superRefine((v, ctx) => {
      const r = reqs(v);
      if (!r.lower || !r.upper || !r.number || !r.special) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Include uppercase, lowercase, a number, and a special character." });
      }
    }),
});

type Values = z.infer<typeof schema>;

function safeNext(raw: string) {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return "/dashboard";
  return raw;
}

const input = {
  display: "block", width: "100%", padding: "12px 16px",
  background: "var(--surface-1)", border: "1px solid var(--border-med)",
  borderRadius: "10px", fontSize: "14px", color: "var(--text-1)",
  outline: "none", fontFamily: "var(--font-public-sans), system-ui, sans-serif",
  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
} as const;
const inputErr = { ...input, borderColor: "var(--danger)" } as const;
const label = { display: "block", fontSize: "13px", fontWeight: 600 as const, color: "var(--text-2)", marginBottom: "7px" };

function onFocus(e: React.FocusEvent<HTMLInputElement>) {
  e.target.style.borderColor = "var(--brand)";
  e.target.style.boxShadow = "0 0 0 3px var(--brand-sub)";
}
function onBlur(hasErr: boolean) {
  return (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = hasErr ? "var(--danger)" : "var(--border-med)";
    e.target.style.boxShadow = "none";
  };
}

const SCORE_COLORS = ["", "var(--danger)", "var(--warning)", "var(--success)"];
const SCORE_LABELS = ["", "Too weak", "Getting there", "Strong ✓"];

export function RegisterForm({ nextPath }: { nextPath: string }) {
  const [show, setShow] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const safe = useMemo(() => safeNext(nextPath), [nextPath]);

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const pw = watch("password") || "";
  const sc = score(pw);
  const r  = reqs(pw);

  async function onSubmit(values: Values) {
    setServerError(null);
    const res = await fetch("/api/auth/register", {
      method: "POST", headers: { "Content-Type": "application/json" },
      credentials: "same-origin", body: JSON.stringify(values),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) { setServerError(data?.error ?? "Registration failed. Please try again."); return; }
    window.location.assign(`/onboarding?next=${encodeURIComponent(safe)}`);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      {serverError && (
        <div style={{ padding: "12px 16px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: "10px", fontSize: "13px", color: "var(--danger)" }}>
          {serverError}
        </div>
      )}

      {/* Name */}
      <div>
        <label style={label}>Full name</label>
        <input type="text" autoComplete="name" placeholder="Your name or company name" {...register("name")}
          style={errors.name ? inputErr : input} onFocus={onFocus} onBlur={onBlur(!!errors.name)} />
        {errors.name && <p style={{ fontSize: "12px", color: "var(--danger)", marginTop: "5px" }}>{errors.name.message}</p>}
      </div>

      {/* Email */}
      <div>
        <label style={label}>Email address</label>
        <input type="email" autoComplete="email" placeholder="you@company.com" {...register("email")}
          style={errors.email ? inputErr : input} onFocus={onFocus} onBlur={onBlur(!!errors.email)} />
        {errors.email && <p style={{ fontSize: "12px", color: "var(--danger)", marginTop: "5px" }}>{errors.email.message}</p>}
      </div>

      {/* Password */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "7px" }}>
          <span style={label}>Password</span>
          <button type="button" onClick={() => { setValue("password", genPassword(14), { shouldValidate: true }); setShow(true); }}
            style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", color: "var(--brand-hi)", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>
            <RefreshCw size={11} /> Generate
          </button>
        </div>
        <div style={{ position: "relative" }}>
          <input type={show ? "text" : "password"} autoComplete="new-password" placeholder="Create a strong password" {...register("password")}
            style={{ ...(errors.password ? inputErr : input), paddingRight: "44px" }} onFocus={onFocus} onBlur={onBlur(!!errors.password)} />
          <button type="button" onClick={() => setShow(v => !v)}
            style={{ position: "absolute", insetInlineEnd: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-3)", display: "flex", padding: "4px" }}>
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {/* Strength bar */}
        {pw && (
          <div style={{ marginTop: "10px" }}>
            <div style={{ display: "flex", gap: "4px", marginBottom: "6px" }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{
                  flex: 1, height: "3px", borderRadius: "2px",
                  background: i <= sc ? SCORE_COLORS[sc] : "var(--border-med)",
                  transition: "background 0.3s ease",
                }} />
              ))}
            </div>
            <p style={{ fontSize: "11px", color: SCORE_COLORS[sc] || "var(--text-3)", fontWeight: 600 }}>{SCORE_LABELS[sc]}</p>
          </div>
        )}

        {/* Requirements */}
        <ul style={{ listStyle: "none", marginTop: "10px", display: "flex", flexDirection: "column", gap: "6px" }}>
          {[
            { ok: r.len,                label: `At least ${MIN} characters` },
            { ok: r.lower && r.upper,   label: "Uppercase & lowercase letters" },
            { ok: r.number && r.special,label: "Number & special character" },
          ].map(item => (
            <li key={item.label} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "11px", color: item.ok ? "var(--success)" : "var(--text-3)" }}>
              <div style={{ width: "14px", height: "14px", borderRadius: "50%", flexShrink: 0, background: item.ok ? "rgba(16,185,129,0.15)" : "var(--surface-2)", border: `1px solid ${item.ok ? "rgba(16,185,129,0.3)" : "var(--border)"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {item.ok && <Check size={8} color="var(--success)" />}
              </div>
              {item.label}
            </li>
          ))}
        </ul>

        {errors.password && <p style={{ fontSize: "12px", color: "var(--danger)", marginTop: "6px" }}>{errors.password.message}</p>}
      </div>

      <button type="submit" disabled={isSubmitting} className="btn btn-primary btn-lg"
        style={{ width: "100%", justifyContent: "center", marginTop: "4px" }}>
        {isSubmitting ? "Creating account…" : "Create account"}
      </button>

      <p style={{ textAlign: "center", fontSize: "13px", color: "var(--text-3)" }}>
        Already have an account?{" "}
        <Link href={`/signin?next=${encodeURIComponent(safe)}`} style={{ color: "var(--brand-hi)", fontWeight: 600 }}>Sign in</Link>
      </p>
    </form>
  );
}
