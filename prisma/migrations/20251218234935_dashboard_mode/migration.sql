-- CreateEnum
CREATE TYPE "DashboardMode" AS ENUM ('TEST', 'LIVE');

-- AlterTable
ALTER TABLE "Merchant" ADD COLUMN     "dashboardMode" "DashboardMode" NOT NULL DEFAULT 'TEST';
