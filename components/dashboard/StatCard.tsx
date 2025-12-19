// components/dashboard/StatCard.tsx
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: string;
  hint?: string;
  icon?: ReactNode;
  tone?: "default" | "good" | "warn";
  className?: string;
};

function toneRing(tone: StatCardProps["tone"]) {
  switch (tone) {
    case "good":
      return "ring-emerald-500/10";
    case "warn":
      return "ring-amber-500/10";
    default:
      return "ring-black/5";
  }
}

function toneIconBg(tone: StatCardProps["tone"]) {
  switch (tone) {
    case "good":
      return "bg-emerald-50 text-emerald-700";
    case "warn":
      return "bg-amber-50 text-amber-700";
    default:
      return "bg-surface text-foreground/70";
  }
}

export default function StatCard({
  label,
  value,
  hint,
  icon,
  tone = "default",
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-white p-4 shadow-sm ring-1",
        toneRing(tone),
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-muted">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-[-0.03em]">
            {value}
          </p>
          {hint ? (
            <p className="mt-1 text-[11px] text-muted">{hint}</p>
          ) : null}
        </div>

        {icon ? (
          <div
            className={cn(
              "inline-flex h-9 w-9 items-center justify-center rounded-xl",
              toneIconBg(tone)
            )}
          >
            {icon}
          </div>
        ) : null}
      </div>
    </div>
  );
}
