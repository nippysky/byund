"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";

const MIN_PASSWORD_LENGTH = 8;

function getPasswordRequirements(password: string) {
  const hasMinLength = password.length >= MIN_PASSWORD_LENGTH;
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  return { hasMinLength, hasLower, hasUpper, hasNumber, hasSpecial };
}

const registerSchema = z.object({
  name: z.string().min(1, "Enter a name.").max(80, "Name is too long."),
  email: z
    .string()
    .email("Enter a valid email address.")
    .transform((s) => s.toLowerCase().trim()),
  password: z
    .string()
    .min(
      MIN_PASSWORD_LENGTH,
      `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`
    )
    .max(200, "Password is too long.")
    .superRefine((val, ctx) => {
      const req = getPasswordRequirements(val);
      if (
        !req.hasLower ||
        !req.hasUpper ||
        !req.hasNumber ||
        !req.hasSpecial
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Password must include uppercase, lowercase, a number, and a special character.",
        });
      }
    }),
});

type RegisterValues = z.infer<typeof registerSchema>;

function getPasswordScore(password: string): number {
  if (!password) return 0;

  const req = getPasswordRequirements(password);
  let score = 0;

  if (req.hasMinLength) score += 1;
  if (req.hasLower && req.hasUpper) score += 1;
  if (req.hasNumber && req.hasSpecial) score += 1;

  return Math.min(score, 3);
}

function getPasswordLabel(score: number): string {
  if (score === 0) return "";
  if (score === 1) return "Too weak";
  if (score === 2) return "Could be stronger";
  return "Strong";
}

function getPasswordColor(score: number): string {
  if (score <= 1) return "text-[#ef4444]";
  if (score === 2) return "text-[#f97316]";
  return "text-[#16a34a]";
}

function getSegmentClass(
  index: number,
  score: number,
  hasValue: boolean
): string {
  if (!hasValue) return "flex-1 h-1 rounded-full bg-border";

  if (score <= 1) {
    return index === 0
      ? "flex-1 h-1 rounded-full bg-[#ef4444]"
      : "flex-1 h-1 rounded-full bg-border";
  }

  if (score === 2) {
    return index <= 1
      ? "flex-1 h-1 rounded-full bg-[#f97316]"
      : "flex-1 h-1 rounded-full bg-border";
  }

  return "flex-1 h-1 rounded-full bg-[#16a34a]";
}

function generateStrongPassword(length = 14): string {
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const specials = "!@#$%^&*()_+-=[]{}|;:,.<>?";

  const all = lowercase + uppercase + numbers + specials;

  let password = "";
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += specials[Math.floor(Math.random() * specials.length)];

  for (let i = password.length; i < length; i++) {
    password += all[Math.floor(Math.random() * all.length)];
  }

  return password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
}

function safeNextPath(raw: string) {
  if (!raw) return "/dashboard";
  if (!raw.startsWith("/")) return "/dashboard";
  if (raw.startsWith("//")) return "/dashboard";
  return raw;
}

export function RegisterForm({ nextPath }: { nextPath: string }) {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const safeNext = useMemo(() => safeNextPath(nextPath), [nextPath]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const password = watch("password") || "";
  const passwordScore = getPasswordScore(password);
  const passwordLabel = getPasswordLabel(passwordScore);
  const hasPasswordValue = password.length > 0;
  const requirements = getPasswordRequirements(password);

  const baseInput =
    "block w-full rounded-md border bg-white px-3 py-2 text-sm outline-none ring-0 transition-colors";
  const normalInput =
    baseInput + " border-border focus:border-accent focus:ring-1 focus:ring-accent";
  const errorInput =
    baseInput +
    " border-[#ef4444] focus:border-[#ef4444] focus:ring-1 focus:ring-[#ef4444]";

  async function onSubmit(values: RegisterValues) {
    setServerError(null);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify(values),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setServerError(data?.error ?? "Registration failed. Please try again.");
      return;
    }

    window.location.assign(safeNext);
  }

  function handleGeneratePassword() {
    const generated = generateStrongPassword(14);
    setShowPassword(true);
    setValue("password", generated, { shouldValidate: true, shouldDirty: true });
  }

  return (
    <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      {serverError && (
        <div className="rounded-xl border border-[#fecaca] bg-[#fef2f2] px-3 py-2 text-xs text-[#991b1b]">
          {serverError}
        </div>
      )}

      {/* Name */}
      <div className="space-y-1.5">
        <label htmlFor="name" className="text-sm font-medium text-foreground">
          Name
        </label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          {...register("name")}
          className={errors.name ? errorInput : normalInput}
          placeholder="NIPPY Studio, Sam'Alia, Chinedu Okafor…"
        />
        {errors.name && <p className="text-xs text-[#ef4444]">{errors.name.message}</p>}
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          Email address
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

      {/* Password */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Password
            </label>
            {hasPasswordValue && (
              <span className={`text-xs font-medium ${getPasswordColor(passwordScore)}`}>
                {passwordLabel}
              </span>
            )}
          </div>
          <button type="button" onClick={handleGeneratePassword} className="text-action text-[11px]">
            Generate strong password
          </button>
        </div>

        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            {...register("password")}
            className={(errors.password ? errorInput : normalInput) + " pr-10"}
            placeholder="Create a strong password"
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

        {/* Strength bar */}
        <div className="mt-2 flex gap-1">
          {[0, 1, 2].map((index) => (
            <div key={index} className={getSegmentClass(index, passwordScore, hasPasswordValue)} />
          ))}
        </div>

        {/* Requirements checklist */}
        <ul className="mt-2 space-y-1 text-[11px] text-muted">
          <li className="flex items-center gap-2">
            <span
              className={
                requirements.hasMinLength
                  ? "h-1.5 w-1.5 rounded-full bg-[#16a34a]"
                  : "h-1.5 w-1.5 rounded-full bg-border"
              }
            />
            <span>At least {MIN_PASSWORD_LENGTH} characters</span>
          </li>
          <li className="flex items-center gap-2">
            <span
              className={
                requirements.hasLower && requirements.hasUpper
                  ? "h-1.5 w-1.5 rounded-full bg-[#16a34a]"
                  : "h-1.5 w-1.5 rounded-full bg-border"
              }
            />
            <span>Uppercase and lowercase letters</span>
          </li>
          <li className="flex items-center gap-2">
            <span
              className={
                requirements.hasNumber && requirements.hasSpecial
                  ? "h-1.5 w-1.5 rounded-full bg-[#16a34a]"
                  : "h-1.5 w-1.5 rounded-full bg-border"
              }
            />
            <span>A number and a special character</span>
          </li>
        </ul>

        {errors.password && <p className="mt-2 text-xs text-[#ef4444]">{errors.password.message}</p>}
      </div>

      <div className="pt-2">
        <Button type="submit" className="w-full justify-center" disabled={isSubmitting}>
          {isSubmitting ? "Creating account…" : "Create account"}
        </Button>
      </div>

      <p className="mt-4 text-xs text-muted">
        Already on BYUND?{" "}
        <Link href={`/signin?next=${encodeURIComponent(safeNext)}`} className="text-action">
          Sign in instead
        </Link>
        .
      </p>
    </form>
  );
}
