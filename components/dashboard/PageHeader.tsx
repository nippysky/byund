// components/dashboard/PageHeader.tsx
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  eyebrow?: string; // optional small label above title
  className?: string;
};

export default function PageHeader({
  title,
  description,
  actions,
  eyebrow = "Dashboard",
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "mb-6 flex flex-col gap-3 md:mb-8 md:flex-row md:items-start md:justify-between",
        className
      )}
    >
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
          {eyebrow}
        </p>
        <h1 className="mt-1 text-xl font-semibold tracking-[-0.03em] md:text-2xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-1 max-w-2xl text-sm text-muted md:text-[13px]">
            {description}
          </p>
        ) : null}
      </div>

      {actions ? (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      ) : null}
    </div>
  );
}
