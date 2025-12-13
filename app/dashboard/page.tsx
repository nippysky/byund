// app/dashboard/page.tsx
import PageHeader from "@/components/dashboard/PageHeader";
import { CreatePaymentLinkButton } from "@/components/dashboard/CreatePaymentLinkButton";

export default function DashboardHome() {
  return (
    <div>
      <PageHeader
        title="Overview"
        description="High-level view of your USD volumes, recent payments, and live status. This is the starting point for V1."
        actions={<CreatePaymentLinkButton size="sm" />}
      />

      <div className="grid gap-4 md:grid-cols-3">
        {/* Simple placeholder cards – replace with real stats later */}
        <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
          <p className="text-xs text-muted">Total processed (USD)</p>
          <p className="mt-2 text-2xl font-semibold tracking-[-0.03em]">
            $0.00
          </p>
          <p className="mt-1 text-[11px] text-muted">
            Your live volume will appear here.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
          <p className="text-xs text-muted">Successful payments</p>
          <p className="mt-2 text-2xl font-semibold tracking-[-0.03em]">0</p>
          <p className="mt-1 text-[11px] text-muted">
            Track converted checkouts over time.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
          <p className="text-xs text-muted">Active links</p>
          <p className="mt-2 text-2xl font-semibold tracking-[-0.03em]">0</p>
          <p className="mt-1 text-[11px] text-muted">
            Hosted payment links you&apos;ve created.
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-white p-4 md:p-6">
        <p className="text-sm font-medium tracking-[-0.01em]">
          Recent activity
        </p>
        <p className="mt-2 text-sm text-muted">
          When your first payments arrive, you&apos;ll see a timeline of events
          here: link created, payment succeeded, settlement, and more.
        </p>
      </div>
    </div>
  );
}
