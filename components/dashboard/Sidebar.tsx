// components/dashboard/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  LinkIcon,
  Settings,
} from "lucide-react";

const navItems = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Payment links",
    href: "/dashboard/payment-links",
    icon: LinkIcon,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

type SidebarProps = {
  mode: "test" | "live";
};

export default function Sidebar({ mode }: SidebarProps) {
  const pathname = usePathname();
  const isLive = mode === "live";

  return (
    <aside className="hidden w-60 flex-none border-r border-border bg-white/95 md:flex md:flex-col">
      {/* Brand */}
      <div className="flex h-16 items-center border-b border-border px-5">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-[18px] font-semibold tracking-[-0.04em]">
            BYUND
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-1 px-3 py-4 text-sm">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2.5 transition-all duration-150",
                "text-foreground/70 hover:text-foreground hover:bg-surface",
                "will-change-transform hover:-translate-y-px",
                active &&
                  "bg-surface text-foreground shadow-[0_1px_6px_rgba(15,17,21,0.05)]"
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="font-medium tracking-[-0.01em]">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom small meta */}
      <div className="border-t border-border px-5 py-3 text-[11px] text-muted">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              isLive ? "bg-emerald-500" : "bg-amber-400"
            )}
          />
          <p>
            {isLive ? "Live mode • Real funds" : "Test mode • Safe sandbox"}
          </p>
        </div>
      </div>
    </aside>
  );
}
