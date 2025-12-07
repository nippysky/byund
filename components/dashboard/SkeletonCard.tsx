// components/dashboard/SkeletonCard.tsx
import { cn } from "@/lib/utils";

export default function SkeletonCard({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-2xl border border-border/70 bg-white/80",
        "shadow-[0_10px_30px_rgba(15,17,21,0.03)]",
        className
      )}
    >
      <div className="h-28 w-full rounded-2xl bg-linear-to-r from-surface via-white to-surface" />
    </div>
  );
}
