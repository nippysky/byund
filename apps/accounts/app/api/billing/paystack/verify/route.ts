export const runtime = "nodejs";

/**
 * POST /api/billing/paystack/verify
 *
 * Called by the client after Paystack popup closes with a reference.
 * Verifies the transaction with Paystack and updates subscription in DB.
 */

import { type NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { cookies } from "next/headers";

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY ?? "";
const API_URL         = process.env.NEXT_PUBLIC_API_URL ?? "https://byund-api.up.railway.app";
const COOKIE          = "byund_session";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { reference, plan } = await req.json();
  if (!reference) return NextResponse.json({ error: "reference required" }, { status: 400 });

  // Verify with Paystack
  const psRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
    headers: { "Authorization": `Bearer ${PAYSTACK_SECRET}` },
  });

  if (!psRes.ok) return NextResponse.json({ error: "Paystack verification failed" }, { status: 400 });
  const psData = await psRes.json();

  if (psData.data?.status !== "success") {
    return NextResponse.json({ error: "Transaction not successful" }, { status: 400 });
  }

  // Update subscription via NestJS
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE)?.value ?? "";

  await fetch(`${API_URL}/v1/billing/subscription`, {
    method:  "PATCH",
    headers: {
      "Content-Type":  "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({
      plan,
      status:                  "active",
      paystackCustomerId:      psData.data?.customer?.id?.toString(),
      paystackSubscriptionCode: psData.data?.plan_object?.id?.toString(),
      paystackPlanCode:        psData.data?.plan?.plan_code,
    }),
  }).catch(console.error);

  return NextResponse.json({ ok: true });
}
