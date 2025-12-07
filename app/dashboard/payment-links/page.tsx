// app/dashboard/payment-links/page.tsx
import PageHeader from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/Button";

export default function PaymentLinksPage() {
  return (
    <div>
      <PageHeader
        title="Payment links"
        description="Create, manage, and track simple USD payment links for your products and invoices."
        actions={
          <Button variant="primary" size="sm">
            New payment link
          </Button>
        }
      />

      <div className="rounded-2xl border border-border bg-white p-4 md:p-6">
        <p className="text-sm font-medium tracking-[-0.01em]">
          No payment links yet
        </p>
        <p className="mt-2 text-sm text-muted">
          Start by creating your first link. You&apos;ll be able to set an
          amount, currency, reference and optional metadata, then share the URL
          with customers.
        </p>
      </div>
    </div>
  );
}
