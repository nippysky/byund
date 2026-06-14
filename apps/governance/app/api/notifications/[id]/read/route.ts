import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

// Notifications are derived from DB state, so "marking read" is client-side only.
// This endpoint exists so the UI can call it without error.
export async function POST() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ ok: true });
}
