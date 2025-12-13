// app/dashboard/payment-links/page.tsx
import PageHeader from "@/components/dashboard/PageHeader";
import PaymentLinksClient from "@/components/dashboard/PaymentLinksClient";


export default function PaymentLinksPage() {
  return (
    <div>
      <PageHeader
        title="Payment links"
        description="Create, manage, and track simple USD payment links for your products and invoices."
      />

      <PaymentLinksClient />
    </div>
  );
}
