import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const MAX_USD_CENTS = 10_000_000_00; // $10,000,000.00

// ✅ Must be set (USDC contract on Base)
const USDC_BASE_TOKEN_ADDRESS =
  process.env.USDC_BASE_TOKEN_ADDRESS?.trim() ||
  process.env.NEXT_PUBLIC_USDC_BASE_TOKEN_ADDRESS?.trim() ||
  "";

function isPositiveInt(n: unknown): n is number {
  return typeof n === "number" && Number.isFinite(n) && n > 0 && Math.floor(n) === n;
}

// ✅ $1.00 (100 cents) => 1_000_000 micros
// ✅ 1 cent => 10_000 micros
function usdCentsToUsdcMicros(cents: number): bigint {
  return BigInt(cents) * BigInt(10_000);
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));

    const publicId = typeof body?.publicId === "string" ? body.publicId.trim() : "";
    const amountUsdCents = body?.amountUsdCents;

    if (!publicId) {
      return NextResponse.json({ ok: false, error: "Missing payment link." }, { status: 400 });
    }
    if (!isPositiveInt(amountUsdCents)) {
      return NextResponse.json({ ok: false, error: "Invalid amount." }, { status: 400 });
    }
    if (amountUsdCents > MAX_USD_CENTS) {
      return NextResponse.json({ ok: false, error: "Amount exceeds the maximum allowed." }, { status: 400 });
    }
    if (!USDC_BASE_TOKEN_ADDRESS) {
      return NextResponse.json(
        { ok: false, error: "Server misconfigured: missing USDC token address." },
        { status: 500 }
      );
    }

    const link = await prisma.paymentLink.findUnique({
      where: { publicId },
      select: {
        id: true,
        publicId: true,
        isActive: true,
        mode: true,
        fixedAmountCents: true,
      },
    });

    if (!link) {
      return NextResponse.json({ ok: false, error: "Payment link not found." }, { status: 404 });
    }
    if (!link.isActive) {
      return NextResponse.json({ ok: false, error: "This payment link is inactive." }, { status: 409 });
    }

    // ✅ Enforce fixed amount
    if (link.mode === "FIXED") {
      const expected = link.fixedAmountCents ?? 0;
      if (expected <= 0 || amountUsdCents !== expected) {
        return NextResponse.json(
          { ok: false, error: "Amount does not match this link’s fixed amount." },
          { status: 400 }
        );
      }
    }

    const payment = await prisma.payment.create({
      data: {
        status: "CREATED",
        amountUsdCents,
        amountUsdcMicros: usdCentsToUsdcMicros(amountUsdCents), // ✅ required BigInt
        tokenAddress: USDC_BASE_TOKEN_ADDRESS,                  // ✅ required
        linkId: link.id,
        // chainId uses schema default(8453)
      },
      select: { id: true },
    });

    return NextResponse.json({
      ok: true,
      paymentId: payment.id,
      redirectTo: `/pay/${encodeURIComponent(link.publicId)}/p/${encodeURIComponent(payment.id)}`,
    });
  } catch {
    return NextResponse.json({ ok: false, error: "Something went wrong." }, { status: 500 });
  }
}
