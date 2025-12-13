// app/pay/[id]/page.tsx
import PayPageClient, { PayPageLink } from "./PayPageClient";

async function getPaymentLink(id: string): Promise<PayPageLink> {
  // TODO: replace with real DB / API lookup by id
  return {
    id,
    merchantName: "Merchant Name",            // public-facing merchant name
    linkName: "Design retainer – March",     // what the customer is paying for
    currency: "USD",
    mode: "fixed",                           // "fixed" | "variable"
    amount: "500.00",                        // required when mode === "fixed"
  };
}

export default async function PayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const link = await getPaymentLink(id);
  const currentYear = new Date().getFullYear();

  return <PayPageClient link={link} currentYear={currentYear} />;
}
