// components/dashboard/settings/SettingsNav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function SettingsNav({
  items,
}: {
  items: Array<{ label: string; href: string }>;
}) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {items.map((it) => {
        const isActive = pathname === it.href;

        return (
          <Link
            key={it.href}
            href={it.href}
            className={cn(
              "rounded-xl px-3 py-2 text-sm transition-colors",
              isActive
                ? "bg-surface text-foreground shadow-[inset_0_0_0_1px_rgba(15,17,21,0.08)]"
                : "text-foreground/80 hover:bg-surface hover:text-foreground"
            )}
            aria-current={isActive ? "page" : undefined}
          >
            <div className="flex items-center justify-between gap-2">
              <span className={cn(isActive ? "font-medium" : "")}>{it.label}</span>
              {isActive ? (
                <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
              ) : null}
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
