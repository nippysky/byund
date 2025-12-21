import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import PayStatusClient, { PayStatusPayload } from "@/components/shared/PayStatusClient";
export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getPayment(paymentId: string) {
  return prisma.payment.findUnique({
    where: { id: paymentId },
    select: {
      id: true,
      status: true,
      amountUsdCents: true,
      createdAt: true,
      link: {
        select: {
          publicId: true,
          name: true,
          merchant: {
            select: {
              publicName: true,
              brandBg: true,
              brandText: true,
            },
          },
        },
      },
    },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; paymentId: string }>;
}): Promise<Metadata> {
  const { id: publicId, paymentId } = await params;
  const payment = await getPayment(paymentId);

  if (!payment?.link || payment.link.publicId !== publicId) {
    return { title: "Payment status • BYUND", robots: { index: false, follow: false } };
  }

  return {
    title: `Payment status • ${payment.link.merchant.publicName}`,
    robots: { index: false, follow: false },
  };
}

export default async function PayStatusPage({
  params,
}: {
  params: Promise<{ id: string; paymentId: string }>;
}) {
  const { id: publicId, paymentId } = await params;

  const payment = await getPayment(paymentId);
  if (!payment?.link) return notFound();
  if (payment.link.publicId !== publicId) return notFound();

  const payload: PayStatusPayload = {
    paymentId: payment.id,
    status: payment.status as PayStatusPayload["status"], // ✅ no `any`
    amountUsdCents: payment.amountUsdCents,
    createdAtIso: payment.createdAt.toISOString(),
    link: {
      publicId: payment.link.publicId,
      linkName: payment.link.name,
    },
    merchant: {
      merchantName: payment.link.merchant.publicName,
      brandBg: payment.link.merchant.brandBg,
      brandText: payment.link.merchant.brandText,
    },
  };

  return <PayStatusClient initial={payload} currentYear={new Date().getFullYear()} />;
}
