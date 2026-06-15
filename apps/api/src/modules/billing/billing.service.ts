import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../common/prisma.service";

export interface PaystackChargeData {
  customer:    { id: number; email: string; customer_code: string };
  plan_object: { name: string; plan_code: string };
  subscription_code?: string;
  next_payment_date?: string;
}

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getSubscription(userId: string) {
    const sub = await this.prisma.subscription.findUnique({ where: { userId } });
    return sub ?? { plan: "free", status: "active", userId };
  }

  async upsertSubscription(userId: string, data: {
    plan?:                    string;
    status?:                  string;
    paystackCustomerId?:      string;
    paystackSubscriptionCode?: string;
    paystackPlanCode?:        string;
    paystackEmailToken?:      string;
    nextPaymentDate?:         Date;
    currentPeriodEnd?:        Date;
  }) {
    return this.prisma.subscription.upsert({
      where:  { userId },
      update: data,
      create: { userId, ...data },
    });
  }

  /**
   * Handle Paystack webhook events.
   * Called from the controller after signature verification.
   */
  async handleWebhook(event: string, data: Record<string, unknown>) {
    this.logger.log(`Paystack webhook: ${event}`);

    switch (event) {
      case "charge.success":
      case "subscription.create": {
        const d = data as unknown as PaystackChargeData;
        const email = d.customer?.email;
        if (!email) return;

        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) { this.logger.warn(`Webhook: no user found for ${email}`); return; }

        const planName = d.plan_object?.name?.toLowerCase()?.split(" ")[0] ?? "starter";
        const nextDate = data["next_payment_date"] as string | undefined;

        await this.upsertSubscription(user.id, {
          plan:                    planName,
          status:                  "active",
          paystackCustomerId:      String(d.customer?.id ?? ""),
          paystackSubscriptionCode: d.subscription_code ?? "",
          paystackPlanCode:        d.plan_object?.plan_code ?? "",
          nextPaymentDate:         nextDate ? new Date(nextDate) : undefined,
        });
        this.logger.log(`Subscription activated for ${email} → ${planName}`);
        break;
      }

      case "subscription.disable":
      case "subscription.not_renew": {
        const d = data as unknown as PaystackChargeData;
        const email = d.customer?.email;
        if (!email) return;
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) return;
        await this.upsertSubscription(user.id, { status: "cancelled" });
        this.logger.log(`Subscription cancelled for ${email}`);
        break;
      }

      case "invoice.payment_failed": {
        const d = data as unknown as { customer: { email: string } };
        const email = d.customer?.email;
        if (!email) return;
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) return;
        await this.upsertSubscription(user.id, { status: "past_due" });
        break;
      }

      default:
        this.logger.log(`Unhandled Paystack event: ${event}`);
    }
  }
}
