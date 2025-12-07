// app/dashboard/activity/page.tsx
import PageHeader from "@/components/dashboard/PageHeader";

export default function ActivityPage() {
  return (
    <div>
      <PageHeader
        title="Activity"
        description="A chronological log of payments, settlements, and webhook deliveries."
      />

      <div className="rounded-2xl border border-border bg-white p-4 md:p-6">
        <p className="text-sm font-medium tracking-[-0.01em]">
          Nothing to see yet
        </p>
        <p className="mt-2 text-sm text-muted">
          As soon as payments start flowing through BYUND, they&apos;ll appear
          here with statuses like <strong>pending</strong>,{" "}
          <strong>succeeded</strong>, and <strong>settled</strong>.
        </p>
      </div>
    </div>
  );
}
