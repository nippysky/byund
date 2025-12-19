// components/dashboard/Topbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import {
  Menu,
  X,
  LayoutDashboard,
  LinkIcon,
  Settings,
  LogOut,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useDashboard } from "./DashboardShell";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Payment links", href: "/dashboard/payment-links", icon: LinkIcon },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "U";
  const a = parts[0]?.[0] ?? "U";
  const b = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";
  return (a + b).toUpperCase().slice(0, 2);
}

function useOnClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  handler: () => void
) {
  useEffect(() => {
    function onDown(e: MouseEvent | TouchEvent) {
      const el = ref.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) handler();
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
    };
  }, [ref, handler]);
}

/**
 * iOS-style switch, consistent with PaymentLinks status toggle
 * - Live: blue gradient (BYUND accent)
 * - Test: neutral gray gradient
 * - pending: spinner inside knob + "Saving…"
 */
function ModeSwitch({
  isLive,
  pending,
  disabled,
  onToggle,
}: {
  isLive: boolean;
  pending?: boolean;
  disabled?: boolean;
  onToggle: () => void;
}) {
  const isDisabled = Boolean(disabled || pending);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isLive}
      aria-busy={pending ? "true" : "false"}
      onClick={onToggle}
      disabled={isDisabled}
      title={isLive ? "Switch to Test mode" : "Switch to Live mode"}
      className={cn(
        "hidden select-none items-center gap-2 rounded-full border border-border bg-white px-2 py-1 text-xs md:inline-flex",
        isDisabled ? "opacity-70 cursor-wait" : "hover:bg-surface/80"
      )}
    >
      <span className="text-[11px] font-medium text-muted">Mode</span>

      {/* Track */}
      <span
        className={cn(
          "relative inline-flex h-6 w-11 items-center rounded-full border transition-colors",
          isLive
            ? "border-accent/40 bg-linear-to-r from-accent to-blue-600"
            : "border-border bg-linear-to-r from-slate-200 to-slate-300"
        )}
      >
        {/* Knob */}
        <span
          className={cn(
            "absolute left-0.5 top-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-sm transition-transform",
            isLive ? "translate-x-5" : "translate-x-0"
          )}
        >
          {pending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-muted" />
          ) : null}
        </span>
      </span>

      <span className="text-[11px] font-medium text-foreground/80">
        {pending ? "Saving…" : isLive ? "Live" : "Test"}
      </span>
    </button>
  );
}

function ProfileMenu() {
  const { profile, logout } = useDashboard();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(wrapRef, () => setOpen(false));

  const name = profile?.name ?? "Merchant";
  const email = profile?.email ?? "";
  const initials = useMemo(() => initialsFromName(name), [name]);

  return (
    <div className="relative" ref={wrapRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center gap-2 rounded-full border border-border bg-white px-2.5 py-1 text-xs text-foreground/80",
          "hover:bg-surface/80 focus:outline-none focus:ring-2 focus:ring-accent/40"
        )}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-accent text-[11px] font-semibold text-white">
          {initials}
        </div>
        <div className="hidden min-w-0 flex-col text-left sm:flex">
          <span className="max-w-45 truncate text-[12px] font-medium text-foreground">
            {name}
          </span>
          {email ? (
            <span className="max-w-45 truncate text-[11px] text-muted">
              {email}
            </span>
          ) : null}
        </div>
        <ChevronDown className="hidden h-4 w-4 text-muted sm:block" />
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-border bg-white shadow-lg shadow-black/5"
          role="menu"
        >
          <div className="px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
              Account
            </p>
            <p className="mt-1 truncate text-sm font-medium text-foreground">
              {name}
            </p>
            {email ? <p className="truncate text-xs text-muted">{email}</p> : null}
          </div>

          <div className="h-px bg-border" />

          <button
            type="button"
            onClick={async () => {
              setOpen(false);
              await logout();
            }}
            className="flex w-full items-center gap-2 px-4 py-3 text-sm text-foreground/90 hover:bg-surface"
            role="menuitem"
          >
            <LogOut className="h-4 w-4 text-muted" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default function Topbar() {
  const pathname = usePathname();
  const { mode, setMode, isModeHydrated } = useDashboard();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isLive = mode === "LIVE";
  const [isSavingMode, startModeTransition] = useTransition();

  function toggleMode() {
    if (!isModeHydrated || isSavingMode) return;
    const next = isLive ? "TEST" : "LIVE";
    startModeTransition(() => {
      // setMode already handles toast + rollback on failure
      void setMode(next);
    });
  }

  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-white/90 px-4 backdrop-blur md:px-6 lg:px-8">
        {/* Mobile logo */}
        <div className="flex items-center gap-2 md:hidden">
          <Link href="/dashboard" className="inline-flex items-center gap-2">
            <span className="text-[17px] font-semibold tracking-[-0.04em]">
              BYUND
            </span>
          </Link>
        </div>

        {/* Desktop breadcrumb / section label */}
        <div className="hidden items-center gap-2 md:flex">
          <span className="text-xs uppercase tracking-[0.18em] text-muted">
            Dashboard
          </span>
          <span className="h-1 w-1 rounded-full bg-border" />
          <span className="text-sm font-medium text-foreground/80">
            {pathname.startsWith("/dashboard/payment-links")
              ? "Payment links"
              : pathname.startsWith("/dashboard/settings")
              ? "Settings"
              : pathname.startsWith("/dashboard/activity")
              ? "Activity"
              : "Overview"}
          </span>
        </div>

        <div className="flex flex-1 justify-end gap-3 md:gap-4">
          {/* ✅ Mode switch (desktop) */}
          <ModeSwitch
            isLive={isLive}
            pending={isSavingMode}
            disabled={!isModeHydrated}
            onToggle={toggleMode}
          />

          {/* Profile */}
          <ProfileMenu />

          {/* Mobile menu toggle */}
          <button
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-white text-foreground md:hidden"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </header>

      {/* Mobile nav sheet */}
      {mobileOpen && (
        <div className="border-b border-border bg-white/98 px-4 pb-3 pt-2 shadow-sm md:hidden">
          {/* ✅ Mobile mode switch (same visual language, stacked) */}
          <div className="mb-3 flex items-center justify-between rounded-2xl border border-border bg-surface/40 px-3 py-2">
            <div className="text-xs">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
                Mode
              </p>
              <p className="mt-0.5 text-sm font-medium text-foreground/80">
                {isSavingMode ? "Saving…" : isLive ? "Live" : "Test"}
              </p>
            </div>

            <button
              type="button"
              onClick={toggleMode}
              disabled={!isModeHydrated || isSavingMode}
              className={cn(
                "relative inline-flex h-7 w-12 items-center rounded-full border transition-colors",
                isLive
                  ? "border-accent/40 bg-linear-to-r from-accent to-blue-600"
                  : "border-border bg-linear-to-r from-slate-200 to-slate-300",
                (!isModeHydrated || isSavingMode) && "opacity-70 cursor-wait"
              )}
              aria-label="Toggle mode"
            >
              <span
                className={cn(
                  "absolute left-0.5 top-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-sm transition-transform",
                  isLive ? "translate-x-5" : "translate-x-0"
                )}
              >
                {isSavingMode ? (
                  <Loader2 className="h-4 w-4 animate-spin text-muted" />
                ) : null}
              </span>
            </button>
          </div>

          <nav className="flex flex-col gap-1 text-sm">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center justify-between rounded-md px-2 py-2 transition-colors",
                    active
                      ? "bg-surface text-foreground"
                      : "text-foreground/80 hover:bg-surface"
                  )}
                >
                  <span className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </span>
                </Link>
              );
            })}

            <div className="mt-3 flex gap-2">
              <Button variant="secondary" size="sm" className="w-full justify-center">
                View docs
              </Button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
