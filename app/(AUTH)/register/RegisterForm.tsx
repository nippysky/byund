"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";

const registerSchema = z.object({
  name: z.string().min(1, "Enter your full name."),
  email: z
    .string()
    .min(1, "Enter a valid email address.")
    .email("Enter a valid email address."),
  password: z
    .string()
    .min(10, "Password must be at least 10 characters."),
});

type RegisterValues = z.infer<typeof registerSchema>;

// Return plain number; we don't need a union here.
function getPasswordScore(password: string): number {
  if (!password) return 0;

  let score = 0;

  if (password.length >= 10) score += 1;
  if (/[0-9]/.test(password) && /[A-Za-z]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  // Clamp to 0–3
  if (score < 0) return 0;
  if (score > 3) return 3;
  return score;
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

  // score === 3
  return "flex-1 h-1 rounded-full bg-[#16a34a]";
}

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // react-hook-form's watch is safe here; React Compiler lint is overly strict.
  // eslint-disable-next-line react-hooks/incompatible-library
  const password = watch("password") || "";

  const passwordScore = getPasswordScore(password);
  const passwordLabel = getPasswordLabel(passwordScore);
  const hasPasswordValue = password.length > 0;

  const baseInput =
    "block w-full rounded-md border bg-white px-3 py-2 text-sm outline-none ring-0 transition-colors";
  const normalInput =
    baseInput + " border-border focus:border-accent focus:ring-1 focus:ring-accent";
  const errorInput =
    baseInput +
    " border-[#ef4444] focus:border-[#ef4444] focus:ring-1 focus:ring-[#ef4444]";

  async function onSubmit(values: RegisterValues) {
    // TODO: wire to server action / API route
    console.log("Register values", values);
  }

  return (
    <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* Name */}
      <div className="space-y-1.5">
        <label
          htmlFor="name"
          className="text-sm font-medium text-foreground"
        >
          Full name
        </label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          {...register("name")}
          className={errors.name ? errorInput : normalInput}
          placeholder="Ada Lovelace"
        />
        {errors.name && (
          <p className="text-xs text-[#ef4444]">{errors.name.message}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <label
          htmlFor="email"
          className="text-sm font-medium text-foreground"
        >
          Work email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          {...register("email")}
          className={errors.email ? errorInput : normalInput}
          placeholder="you@company.com"
        />
        {errors.email && (
          <p className="text-xs text-[#ef4444]">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor="password"
            className="text-sm font-medium text-foreground"
          >
            Password
          </label>
          {hasPasswordValue && (
            <span
              className={`text-xs font-medium ${getPasswordColor(passwordScore)}`}
            >
              {passwordLabel}
            </span>
          )}
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
            <div
              key={index}
              className={getSegmentClass(index, passwordScore, hasPasswordValue)}
            />
          ))}
        </div>

        {/* Helper / error text */}
        {errors.password ? (
          <p className="mt-2 text-xs text-[#ef4444]">
            {errors.password.message}
          </p>
        ) : (
          hasPasswordValue && (
            <p className="mt-2 text-xs text-muted">
              Use at least 10 characters with a mix of letters, numbers,
              and symbols.
            </p>
          )
        )}
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          className="w-full justify-center"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating account…" : "Create account"}
        </Button>
      </div>

      <p className="mt-4 text-xs text-muted">
        Already on BYUND?{" "}
        <Link href="/signin" className="text-action">
          Sign in instead
        </Link>
        .
      </p>
    </form>
  );
}
