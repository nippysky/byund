import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import PayPageClient from "@/components/shared/PayPageClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

  const merchant = link.merchant.publicName;
  const paymentName = link.name;

  const title = `Pay ${merchant} • ${paymentName}`;
  const description = link.description?.slice(0, 155) || `Complete a secure checkout to ${merchant}.`;

  return { title, description, openGraph: { title, description } };
}

export default async function PayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: publicId } = await params;

  const link = await getLink(publicId);
  if (!link) {
    // still 404 for truly missing link
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="max-w-md w-full rounded-2xl border border-border bg-white p-6 text-center">
          <p className="text-sm font-semibold">Link not found</p>
          <p className="mt-2 text-sm text-muted">This payment link doesn’t exist.</p>
        </div>
      </div>
    );
  }

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
    isActive: link.isActive,
  };

  return <PayPageClient link={payload} currentYear={new Date().getFullYear()} />;
}
