// components/dashboard/settings/DeveloperSettingsCard.tsx
export default function DeveloperSettingsCard() {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-white p-4 shadow-[0_8px_25px_rgba(15,17,21,0.06)] md:p-6">
        <p className="text-sm font-semibold tracking-[-0.01em]">API & keys</p>
        <p className="mt-1 text-sm text-muted">
          Keys + webhook signing are coming next. This section is intentionally “ready” so we don’t
          refactor later.
        </p>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-surface/40 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
              Test API key
            </p>
            <p className="mt-2 font-mono text-sm text-muted">Coming soon</p>
          </div>

          <div className="rounded-xl border border-border bg-surface/40 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
              Live API key
            </p>
            <p className="mt-2 font-mono text-sm text-muted">Coming soon</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-white p-4 shadow-[0_8px_25px_rgba(15,17,21,0.06)] md:p-6">
        <p className="text-sm font-semibold tracking-[-0.01em]">Webhooks</p>
        <p className="mt-1 text-sm text-muted">
          We’ll support webhook delivery and signatures (Stripe-style). For now, the Activity page is
          the single source of truth.
        </p>

        <div className="mt-5 rounded-xl border border-border bg-surface/40 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
            Webhook endpoint
          </p>
          <p className="mt-2 text-sm text-muted">Coming soon</p>
        </div>
      </div>
    </div>
  );
}
