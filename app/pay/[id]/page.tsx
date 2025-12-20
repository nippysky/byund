// app/pay/[id]/page.tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import PayPageClient from "@/components/shared/PayPageClient";

export type PayPageLink = {
  publicId: string;

  merchantName: string;
  linkName: string;
  description: string | null;

  currency: "USD";
  mode: "fixed" | "variable";
  fixedAmountCents: number | null;

  brandBg: string;
  brandText: string;

  // ✅ new
  isActive: boolean;
};

async function getLink(publicId: string) {
  return prisma.paymentLink.findUnique({
    where: { publicId },
    select: {
      publicId: true,
      name: true,
      description: true,
      currency: true,
      mode: true,
      fixedAmountCents: true,
      isActive: true,
      merchant: {
        select: {
          publicName: true,
          brandBg: true,
          brandText: true,
        },
      },
    },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id: publicId } = await params;
  const link = await getLink(publicId);

  if (!link) {
    return { title: "Checkout • BYUND", robots: { index: false, follow: false } };
  }

  // ✅ Inactive: keep it unindexed, but show a real page
  if (!link.isActive) {
    return {
      title: "Link unavailable • BYUND",
      robots: { index: false, follow: false },
    };
  }

  const merchant = link.merchant.publicName;
  const paymentName = link.name;

  const title = `Pay ${merchant} • ${paymentName}`;
  const description =
    link.description?.slice(0, 155) || `Complete a secure checkout to ${merchant}.`;

  return { title, description, openGraph: { title, description } };
}

export default async function PayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: publicId } = await params;

  const link = await getLink(publicId);
  if (!link) return notFound();

  const payload: PayPageLink = {
    publicId: link.publicId,
    merchantName: link.merchant.publicName,
    linkName: link.name,
    description: link.description ?? null,
    currency: "USD",
    mode: link.mode === "FIXED" ? "fixed" : "variable",
    fixedAmountCents: link.fixedAmountCents ?? null,
    brandBg: link.merchant.brandBg,
    brandText: link.merchant.brandText,
    isActive: Boolean(link.isActive),
  };

  return <PayPageClient link={payload} currentYear={new Date().getFullYear()} />;
}
