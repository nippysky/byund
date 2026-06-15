export const runtime = "nodejs";

/**
 * GET /api/user/avatar/sign
 *
 * Returns a signed Cloudinary upload signature so the client can upload
 * directly to Cloudinary without exposing the API secret.
 *
 * Architecture (secure, scalable):
 *   Client → GET /api/user/avatar/sign → { signature, timestamp, cloudName, apiKey, uploadPreset }
 *   Client → POST https://api.cloudinary.com/v1_1/{cloud}/image/upload (direct, with signature)
 *   Client → PATCH /api/user/avatar { avatarUrl } → saves URL to DB
 *
 * API secret never leaves the server.
 */

import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createHash } from "crypto";

function signCloudinary(params: Record<string, string | number>, secret: string): string {
  const sorted = Object.keys(params)
    .sort()
    .map(k => `${k}=${params[k]}`)
    .join("&");
  return createHash("sha256").update(sorted + secret).digest("hex");
}

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const cloudName    = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey       = process.env.CLOUDINARY_API_KEY;
  const apiSecret    = process.env.CLOUDINARY_API_SECRET;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "byund_avatars";

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json({ error: "Cloudinary not configured" }, { status: 503 });
  }

  const timestamp = Math.round(Date.now() / 1000);
  const folder    = "byund/avatars";

  const params: Record<string, string | number> = {
    folder,
    timestamp,
    upload_preset: uploadPreset,
  };

  const signature = signCloudinary(params, apiSecret);

  return NextResponse.json({ signature, timestamp, cloudName, apiKey, uploadPreset, folder });
}
