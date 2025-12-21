import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ paymentId: string }> }
) {
  try {
    const { paymentId } = await params;

    if (!paymentId) {
      return NextResponse.json({ ok: false, error: "Missing payment id." }, { status: 400 });
    }

    const payment = await prisma.payment.findUnique({
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

    if (!payment || !payment.link) {
      return NextResponse.json({ ok: false, error: "Payment not found." }, { status: 404 });
    }

    return NextResponse.json({
      ok: true,
      payment: {
        id: payment.id,
        status: payment.status,
        amountUsdCents: payment.amountUsdCents,
        createdAt: payment.createdAt.toISOString(),
        link: {
          publicId: payment.link.publicId,
          name: payment.link.name,
        },
        merchant: {
          name: payment.link.merchant.publicName,
          brandBg: payment.link.merchant.brandBg,
          brandText: payment.link.merchant.brandText,
        },
      },
    });
  } catch {
    return NextResponse.json({ ok: false, error: "Something went wrong." }, { status: 500 });
  }
}
