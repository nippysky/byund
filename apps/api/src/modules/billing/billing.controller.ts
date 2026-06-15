import {
  Body, Controller, Get, Patch, Post, Req, Res,
  HttpCode, HttpStatus, UseGuards, UnauthorizedException, Logger,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { createHmac } from "crypto";
import type { FastifyReply, FastifyRequest } from "fastify";
import { BillingService } from "./billing.service";
import type { SessionPayload } from "../auth/auth.service";

@ApiTags("Billing")
@Controller("billing")
export class BillingController {
  private readonly logger = new Logger(BillingController.name);

  constructor(private readonly billing: BillingService) {}

  // ─────────────────────────────────────────────
  // GET /v1/billing/subscription
  // ─────────────────────────────────────────────
  @Get("subscription")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get current user subscription" })
  async getSubscription(@Req() req: FastifyRequest & { user: SessionPayload }) {
    return this.billing.getSubscription(req.user.sub);
  }

  // ─────────────────────────────────────────────
  // PATCH /v1/billing/subscription
  // ─────────────────────────────────────────────
  @Patch("subscription")
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update subscription (post-payment verify)" })
  async updateSubscription(
    @Req()  req:  FastifyRequest & { user: SessionPayload },
    @Body() body: Record<string, string>,
  ) {
    return this.billing.upsertSubscription(req.user.sub, body);
  }

  // ─────────────────────────────────────────────
  // POST /v1/billing/paystack/webhook
  // ─────────────────────────────────────────────
  @Post("paystack/webhook")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Paystack webhook receiver" })
  async paystackWebhook(
    @Req()  req:  FastifyRequest,
    @Res()  res:  FastifyReply,
    @Body() body: { event: string; data: Record<string, unknown> },
  ) {
    // Verify signature
    const secret    = process.env.PAYSTACK_SECRET_KEY ?? "";
    const signature = (req.headers["x-paystack-signature"] as string) ?? "";

    // Allow internal forwarding from accounts Next.js (already verified there)
    const internalSecret = process.env.INTERNAL_API_SECRET ?? "";
    const fromInternal   = req.headers["x-internal-secret"] === internalSecret && !!internalSecret;

    if (!fromInternal && secret) {
      const rawBody = JSON.stringify(body);
      const hash    = createHmac("sha512", secret).update(rawBody).digest("hex");
      if (hash !== signature) {
        this.logger.warn("Paystack webhook signature mismatch");
        throw new UnauthorizedException("Invalid signature");
      }
    }

    await this.billing.handleWebhook(body.event, body.data);
    return res.status(200).send({ received: true });
  }
}
