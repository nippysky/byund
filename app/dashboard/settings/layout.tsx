// app/dashboard/settings/layout.tsx
import SettingsNav from "@/components/dashboard/settings/SettingsNav";
import { unstable_noStore as noStore } from "next/cache";


export const dynamic = "force-dynamic";
export const revalidate = 0;

const items = [
  { label: "Business profile", href: "/dashboard/settings/profile" },
  { label: "Settlement wallet", href: "/dashboard/settings/wallet" },
  { label: "Branding", href: "/dashboard/settings/branding" },
  { label: "API & webhooks", href: "/dashboard/settings/developers" },
];

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

        <SettingsNav items={items} />
      </aside>

      {/* Main */}
      <section className="min-w-0">{children}</section>
    </div>
  );
}
