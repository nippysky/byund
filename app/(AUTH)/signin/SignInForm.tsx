"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";

const signInSchema = z.object({
  email: z.string().min(1, "Enter a valid email address.").email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
});

type SignInValues = z.infer<typeof signInSchema>;

function safeNextPath(raw: string) {
  if (!raw) return "/dashboard";
  if (!raw.startsWith("/")) return "/dashboard";
  if (raw.startsWith("//")) return "/dashboard";
  return raw;
}

const inputStyle = {
  display: "block",
  width: "100%",
  padding: "12px 16px",
  background: "var(--surface-1)",
  border: "1px solid var(--border-med)",
  borderRadius: "10px",
  fontSize: "14px",
  color: "var(--text-1)",
  outline: "none",
  fontFamily: "var(--font-public-sans), system-ui, sans-serif",
  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
} as const;

const inputErrorStyle = {
  ...inputStyle,
  borderColor: "var(--danger)",
} as const;

const labelStyle = {
  display: "block",
  fontSize: "13px",
  fontWeight: 600,
  color: "var(--text-2)",
  marginBottom: "7px",
} as const;

const errorStyle = {
  fontSize: "12px",
  color: "var(--danger)",
  marginTop: "5px",
} as const;

export function SignInForm({ nextPath }: { nextPath: string }) {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const safeNext = useMemo(() => safeNextPath(nextPath), [nextPath]);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: SignInValues) {
    setServerError(null);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify(values),
    });
    const data: { ok?: boolean; error?: string; onboardingRequired?: boolean } = await res.json().catch(() => ({}));
    if (!res.ok || !data?.ok) {
      setServerError(data?.error ?? "Sign in failed. Please try again.");
      return;
    }
    const go = data.onboardingRequired ? `/onboarding?next=${encodeURIComponent(safeNext)}` : safeNext;
    window.location.assign(go);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {serverError && (
        <div style={{
          padding: "12px 16px",
          background: "rgba(239,68,68,0.08)",
          border: "1px solid rgba(239,68,68,0.25)",
          borderRadius: "10px",
          fontSize: "13px",
          color: "var(--danger)",
        }}>
          {serverError}
        </div>
      )}

      {/* Email */}
      <div>
        <label htmlFor="email" style={labelStyle}>Email address</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          {...register("email")}
          style={errors.email ? inputErrorStyle : inputStyle}
          onFocus={e => {
            (e.target as HTMLInputElement).style.borderColor = "var(--brand)";
            (e.target as HTMLInputElement).style.boxShadow = "0 0 0 3px var(--brand-sub)";
          }}
          onBlur={e => {
            (e.target as HTMLInputElement).style.borderColor = errors.email ? "var(--danger)" : "var(--border-med)";
            (e.target as HTMLInputElement).style.boxShadow = "none";
          }}
        />
        {errors.email && <p style={errorStyle}>{errors.email.message}</p>}
      </div>

      {/* Password */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "7px" }}>
          <label htmlFor="password" style={{ ...labelStyle, marginBottom: 0 }}>Password</label>
          <Link href="/forgot-password" style={{ fontSize: "12px", color: "var(--brand-hi)", fontWeight: 500 }}>
            Forgot password?
          </Link>
        </div>
        <div style={{ position: "relative" }}>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
            {...register("password")}
            style={{ ...(errors.password ? inputErrorStyle : inputStyle), paddingRight: "44px" }}
            onFocus={e => {
              (e.target as HTMLInputElement).style.borderColor = "var(--brand)";
              (e.target as HTMLInputElement).style.boxShadow = "0 0 0 3px var(--brand-sub)";
            }}
            onBlur={e => {
              (e.target as HTMLInputElement).style.borderColor = errors.password ? "var(--danger)" : "var(--border-med)";
              (e.target as HTMLInputElement).style.boxShadow = "none";
            }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(v => !v)}
            style={{
              position: "absolute", insetInlineEnd: "12px", top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none", cursor: "pointer",
              color: "var(--text-3)", display: "flex", padding: "4px",
            }}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && <p style={errorStyle}>{errors.password.message}</p>}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn btn-primary btn-lg"
        style={{ width: "100%", justifyContent: "center", marginTop: "4px" }}
      >
        {isSubmitting ? "Signing in…" : "Sign in"}
      </button>

      <p style={{ textAlign: "center", fontSize: "13px", color: "var(--text-3)" }}>
        New to BYUND?{" "}
        <Link href={`/register?next=${encodeURIComponent(safeNext)}`} style={{ color: "var(--brand-hi)", fontWeight: 600 }}>
          Create an account
        </Link>
      </p>
    </form>
  );
}
