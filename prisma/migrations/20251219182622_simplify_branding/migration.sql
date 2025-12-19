/*
  Warnings:

  - You are about to drop the column `brandAccent` on the `Merchant` table. All the data in the column will be lost.
  - You are about to drop the column `brandLeftBg` on the `Merchant` table. All the data in the column will be lost.
  - You are about to drop the column `brandLeftFg` on the `Merchant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Merchant" DROP COLUMN "brandAccent",
DROP COLUMN "brandLeftBg",
DROP COLUMN "brandLeftFg",
ADD COLUMN     "brandBg" TEXT NOT NULL DEFAULT '#EAF2FF',
ADD COLUMN     "brandText" TEXT NOT NULL DEFAULT '#0B1220';
