"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";

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

export function SignInForm({ nextPath }: { nextPath: string }) {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const safeNext = useMemo(() => safeNextPath(nextPath), [nextPath]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const baseInput =
    "block w-full rounded-md border bg-white px-3 py-2 text-sm outline-none ring-0 transition-colors";
  const normalInput = baseInput + " border-border focus:border-accent focus:ring-1 focus:ring-accent";
  const errorInput =
    baseInput + " border-[#ef4444] focus:border-[#ef4444] focus:ring-1 focus:ring-[#ef4444]";

  async function onSubmit(values: SignInValues) {
    setServerError(null);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify(values),
    });

    const data: { ok?: boolean; error?: string; onboardingRequired?: boolean } = await res
      .json()
      .catch(() => ({}));

    if (!res.ok || !data?.ok) {
      setServerError(data?.error ?? "Sign in failed. Try again.");
      return;
    }

    const go = data.onboardingRequired
      ? `/onboarding?next=${encodeURIComponent(safeNext)}`
      : safeNext;

    window.location.assign(go);
  }

  return (
    <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      {serverError && (
        <div className="rounded-xl border border-[#fecaca] bg-[#fef2f2] px-3 py-2 text-xs text-[#991b1b]">
          {serverError}
        </div>
      )}

      <div className="space-y-1.5">
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          {...register("email")}
          className={errors.email ? errorInput : normalInput}
          placeholder="you@example.com"
        />
        {errors.email && <p className="text-xs text-[#ef4444]">{errors.email.message}</p>}
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="text-sm font-medium text-foreground">
            Password
          </label>
          <Link href="#" className="text-action text-xs">
            Forgot password?
          </Link>
        </div>

        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            {...register("password")}
            className={(errors.password ? errorInput : normalInput) + " pr-10"}
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted hover:text-foreground focus:outline-none"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            <svg
              aria-hidden="true"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
            >
              <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
        </div>

        {errors.password && <p className="text-xs text-[#ef4444]">{errors.password.message}</p>}
      </div>

      <div className="pt-2">
        <Button type="submit" className="w-full justify-center" disabled={isSubmitting}>
          {isSubmitting ? "Signing in…" : "Sign in"}
        </Button>
      </div>

      <p className="mt-4 text-xs text-muted">
        New to BYUND?{" "}
        <Link href={`/register?next=${encodeURIComponent(safeNext)}`} className="text-action">
          Create an account
        </Link>
        .
      </p>
    </form>
  );
}
