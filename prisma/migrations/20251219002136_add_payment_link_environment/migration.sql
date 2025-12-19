-- AlterTable
ALTER TABLE "PaymentLink" ADD COLUMN     "environment" "DashboardMode" NOT NULL DEFAULT 'TEST';

-- CreateIndex
CREATE INDEX "PaymentLink_merchantId_environment_idx" ON "PaymentLink"("merchantId", "environment");
