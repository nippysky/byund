import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { writeAuditLog } from "@/lib/audit";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  const assets = await prisma.asset.findMany({
    where: { workspaceId: session.workspaceId, archivedAt: null, ...(type ? { type: type as any } : {}) },
    orderBy: [{ criticality: "desc" }, { name: "asc" }],
  });

  return NextResponse.json(assets);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, type, criticality, description, environment, reviewCycleDays = 90 } = body;

  if (!name || !type || !criticality) return NextResponse.json({ error: "name, type, criticality required" }, { status: 400 });

  const now = new Date();
  const nextReviewDue = new Date(now.getTime() + reviewCycleDays * 24 * 60 * 60 * 1000);

  const asset = await prisma.asset.create({
    data: { workspaceId: session.workspaceId, name, type, criticality, description, environment, reviewCycleDays, nextReviewDue },
  });

  // Auto-schedule first review
  await prisma.review.create({
    data: { workspaceId: session.workspaceId, assetId: asset.id, scheduledAt: now, dueAt: nextReviewDue, status: "UPCOMING" },
  });

  await writeAuditLog({ workspaceId: session.workspaceId, actorId: session.userId, action: "ASSET_CREATED", targetType: "Asset", targetId: asset.id, targetLabel: asset.name });

  return NextResponse.json(asset, { status: 201 });
}
