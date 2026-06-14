import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { writeAuditLog } from "@/lib/audit";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const asset = await prisma.asset.findFirst({
    where: { id, workspaceId: session.workspaceId },
    include: { reviews: { orderBy: { dueAt: "desc" }, take: 5 }, findings: { where: { status: { not: "RESOLVED" } } } },
  });
  if (!asset) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(asset);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const body = await req.json();
  const asset = await prisma.asset.updateMany({
    where: { id, workspaceId: session.workspaceId },
    data: { ...body, updatedAt: new Date() },
  });
  if (!asset.count) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await prisma.asset.findUnique({ where: { id } });
  await writeAuditLog({ workspaceId: session.workspaceId, actorId: session.userId, action: "ASSET_UPDATED", targetType: "Asset", targetId: id, targetLabel: updated?.name });

  return NextResponse.json(updated);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const asset = await prisma.asset.findFirst({ where: { id, workspaceId: session.workspaceId } });
  if (!asset) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.asset.update({ where: { id }, data: { archivedAt: new Date() } });
  await writeAuditLog({ workspaceId: session.workspaceId, actorId: session.userId, action: "ASSET_ARCHIVED", targetType: "Asset", targetId: id, targetLabel: asset.name });

  return NextResponse.json({ archived: true });
}
