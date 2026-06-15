export const runtime = "nodejs";

/**
 * POST /api/billing/paystack/webhook
 *
 * Receives Paystack webhook events and proxies them to the NestJS API
 * which updates the subscriptions table.
 *
 * Configure in Paystack Dashboard → Settings → API Keys & Webhooks:
 *   URL: https://byund-accounts.vercel.app/api/billing/paystack/webhook
 */

import { type NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY ?? "";
const API_URL         = process.env.NEXT_PUBLIC_API_URL ?? "https://byund-api.up.railway.app";

function verifyPaystackSignature(body: string, signature: string): boolean {
  if (!PAYSTACK_SECRET) return false;
  const hash = createHmac("sha512", PAYSTACK_SECRET).update(body).digest("hex");
  return hash === signature;
}

export async function POST(req: NextRequest) {
  const rawBody  = await req.text();
  const signature = req.headers.get("x-paystack-signature") ?? "";

  if (!verifyPaystackSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let event: { event: string; data: Record<string, unknown> };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Forward to NestJS for DB processing
  try {
    await fetch(`${API_URL}/v1/billing/paystack/webhook`, {
      method:  "POST",
      headers: {
        "Content-Type":          "application/json",
        "x-paystack-signature":  signature,
        "x-internal-secret":     process.env.INTERNAL_API_SECRET ?? "",
      },
      body: rawBody,
    });
  } catch (e) {
    console.error("[Paystack webhook] Failed to forward to API:", e);
    // Still return 200 to Paystack to avoid retries for our own forwarding failures
  }

  console.log(`[Paystack webhook] ${event.event} received`);
  return NextResponse.json({ received: true });
}
