// components/dashboard/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, LinkIcon, Settings, Activity } from "lucide-react";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Payment links", href: "/dashboard/payment-links", icon: LinkIcon },
  { label: "Activity", href: "/dashboard/activity", icon: Activity },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

type SidebarProps = {
  mode: "test" | "live";
};

function isActivePath(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(href + "/");
}

export default function Sidebar({ mode }: SidebarProps) {
  const pathname = usePathname();
  const isLive = mode === "live";

  return (
    <aside className="hidden w-64 flex-none border-r border-border bg-white/95 md:flex md:flex-col">
      {/* Brand */}
      <div className="flex h-16 items-center justify-between border-b border-border px-5">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-[18px] font-semibold tracking-[-0.04em]">BYUND</span>
        </Link>

        {/* Mode badge */}
        <div
          className={cn(
            "inline-flex items-center gap-2 rounded-full border px-2 py-1 text-[11px]",
            isLive ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-amber-200 bg-amber-50 text-amber-700"
          )}
          aria-label="Current mode"
        >
          <span className={cn("h-1.5 w-1.5 rounded-full", isLive ? "bg-emerald-500" : "bg-amber-400")} />
          {isLive ? "Live" : "Test"}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col px-3 py-4 text-sm">
        <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
          Workspace
        </p>

        <div className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActivePath(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center justify-between rounded-xl px-3 py-2.5 transition-all duration-150",
                  "text-foreground/70 hover:text-foreground hover:bg-surface",
                  "will-change-transform hover:-translate-y-px",
                  active && "bg-surface text-foreground shadow-[0_1px_10px_rgba(15,17,21,0.06)]"
                )}
              >
                <span className="flex items-center gap-2">
                  <Icon className={cn("h-4 w-4", active ? "text-foreground" : "text-muted group-hover:text-foreground")} />
                  <span className="font-medium tracking-[-0.01em]">{item.label}</span>
                </span>

                {active ? (
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                ) : null}
              </Link>
            );
          })}
        </div>

        {/* Nice spacer */}
        <div className="mt-6 rounded-2xl border border-dashed border-border bg-surface/40 px-4 py-3 text-[12px]">
          <p className="font-medium tracking-[-0.01em] text-foreground">Tip</p>
          <p className="mt-1 text-[11px] text-muted">
            Start in <span className="font-medium text-foreground">Test</span> to validate your checkout and webhooks,
            then switch to <span className="font-medium text-foreground">Live</span> when ready.
          </p>
        </div>
      </nav>

      {/* Bottom meta */}
      <div className="border-t border-border px-5 py-3 text-[11px] text-muted">
        <p>
          {isLive ? "Live mode • Real funds" : "Test mode • Safe sandbox"}
        </p>
      </div>
    </aside>
  );
}
