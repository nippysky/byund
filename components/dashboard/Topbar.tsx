// components/dashboard/Topbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Menu,
  X,
  LayoutDashboard,
  LinkIcon,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Payment links", href: "/dashboard/payment-links", icon: LinkIcon },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

type TopbarProps = {
  mode: "test" | "live";
  onModeChange: (mode: "test" | "live") => void;
};

export default function Topbar({ mode, onModeChange }: TopbarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isLive = mode === "live";

  return (
    <>
      {/* Topbar */}
      <header className="flex h-16 items-center justify-between border-b border-border bg-white/90 px-4 backdrop-blur md:px-6 lg:px-8">
        {/* Mobile logo */}
        <div className="flex items-center gap-2 md:hidden">
          <Link href="/dashboard">
            <span className="text-[17px] font-semibold tracking-[-0.04em]">
              BYUND
            </span>
          </Link>
        </div>

        {/* Page indicator */}
        <div className="hidden items-center gap-2 text-sm text-muted md:flex">
          <span className="text-xs uppercase tracking-[0.18em] text-muted">
            Dashboard
          </span>
        </div>

        <div className="flex flex-1 justify-end gap-3 md:gap-4">
          {/* Environment pill – desktop */}
          <div className="hidden items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted md:flex">
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                isLive ? "bg-emerald-500" : "bg-amber-400"
              )}
            />
            <button
              type="button"
              onClick={() => onModeChange("test")}
              className={cn(
                "rounded-full px-2 py-0.5 text-[11px]",
                !isLive ? "bg-accent text-white" : "text-muted"
              )}
            >
              Test
            </button>
            <button
              type="button"
              onClick={() => onModeChange("live")}
              className={cn(
                "rounded-full px-2 py-0.5 text-[11px]",
                isLive ? "bg-accent text-white" : "text-muted"
              )}
            >
              Live
            </button>
          </div>

          {/* Account stub */}
          <button className="flex items-center gap-2 rounded-full border border-border bg-white px-2.5 py-1 text-xs text-foreground/80 hover:bg-surface/80">
            <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-accent text-[11px] font-semibold text-white">
              B
            </div>
            <span className="hidden sm:inline-block">Studio BYUND</span>
          </button>

          {/* Mobile menu toggle */}
          <button
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-white text-foreground md:hidden"
            onClick={() => setOpen((prev) => !prev)}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </header>

      {/* Mobile nav sheet */}
      {open && (
        <div className="border-b border-border bg-white/98 px-4 pb-3 pt-2 shadow-sm md:hidden">
          {/* Mobile environment toggle */}
          <div className="mb-3 inline-flex items-center gap-1 rounded-full border border-border bg-surface px-1 py-0.5 text-[11px] text-muted">
            <button
              type="button"
              onClick={() => onModeChange("test")}
              className={cn(
                "rounded-full px-2 py-0.5",
                !isLive ? "bg-accent text-white" : "text-muted"
              )}
            >
              Test
            </button>
            <button
              type="button"
              onClick={() => onModeChange("live")}
              className={cn(
                "rounded-full px-2 py-0.5",
                isLive ? "bg-accent text-white" : "text-muted"
              )}
            >
              Live
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
                  onClick={() => setOpen(false)}
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
              <Button
                variant="secondary"
                size="sm"
                className="w-full justify-center"
              >
                View docs
              </Button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
