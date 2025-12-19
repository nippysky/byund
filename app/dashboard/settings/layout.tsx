// app/dashboard/settings/layout.tsx
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { cn } from "@/lib/utils";

const items = [
  { label: "Business profile", href: "/dashboard/settings/profile" },
  { label: "Settlement wallet", href: "/dashboard/settings/wallet" },
  { label: "Branding", href: "/dashboard/settings/branding" },
  { label: "API & webhooks", href: "/dashboard/settings/developers" },
];

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  noStore();

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
      {/* Left nav */}
      <aside className="rounded-2xl border border-border bg-white p-3 shadow-[0_8px_25px_rgba(15,17,21,0.06)]">
        <p className="px-3 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
          Settings
        </p>

        <nav className="flex flex-col gap-1">
          {items.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              className={cn(
                "rounded-xl px-3 py-2 text-sm text-foreground/80 hover:bg-surface",
                // "active" styling is handled at page-level by the top header;
                // keep nav neutral and clean.
                "transition-colors"
              )}
            >
              {it.label}
            </Link>
          ))}
        </nav>

        <div className="mt-4 rounded-xl border border-border bg-surface/50 px-3 py-3 text-xs text-muted">
          <p className="font-medium text-foreground">Timezone</p>
          <p className="mt-1">
            All timestamps use <span className="font-medium">Africa/Lagos (WAT)</span>.
          </p>
          <p className="mt-2">
            BYUND originated from Nigeria (West Africa).
          </p>
        </div>
      </aside>

      {/* Main */}
      <section className="min-w-0">{children}</section>
    </div>
  );
}
