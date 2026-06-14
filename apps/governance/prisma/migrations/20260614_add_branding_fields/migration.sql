-- AddColumn branding fields to workspace_settings
ALTER TABLE "workspace_settings" ADD COLUMN IF NOT EXISTS "brandName" TEXT;
ALTER TABLE "workspace_settings" ADD COLUMN IF NOT EXISTS "brandColor" TEXT;
ALTER TABLE "workspace_settings" ADD COLUMN IF NOT EXISTS "brandLogoUrl" TEXT;
ALTER TABLE "workspace_settings" ADD COLUMN IF NOT EXISTS "faviconUrl" TEXT;
ALTER TABLE "workspace_settings" ADD COLUMN IF NOT EXISTS "customDomain" TEXT;
