import PageHeader from "@/components/dashboard/PageHeader";

export default async function PaymentLinkDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const shortId = id.slice(0, 8);

  return (
    <div>
      <PageHeader
        title="Payment link activity"
        description={`Timeline and details for /pay/${shortId}. In V1 this will show payments, statuses, and settlements.`}
      />

      <div className="space-y-4">
        <div className="rounded-2xl border border-border bg-white p-4 md:p-6 text-sm text-muted">
          <p>You&apos;re looking at the activity view for link:</p>
          <p className="mt-1 break-all font-mono text-[13px] text-foreground">
            {id}
          </p>
          <p className="mt-3">Once the backend is wired, this page will include:</p>
          <ul className="mt-1 list-disc space-y-1 pl-5">
            <li>Chronological list of payment attempts and statuses.</li>
            <li>Settlement events to your wallet in Test or Live mode.</li>
            <li>Webhook delivery logs and error details.</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-dashed border-border bg-surface/50 p-4 text-xs text-muted md:p-5">
          <p className="font-medium text-foreground">Coming soon</p>
          <p className="mt-1">
            As we connect BYUND to the on-chain indexer and database, this page
            will become the main debugging surface for each link.
          </p>
        </div>
      </div>
    </div>
  );
}
