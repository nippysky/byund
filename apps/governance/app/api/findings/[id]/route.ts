import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { writeAuditLog } from "@/lib/audit";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const body = await req.json();
  const finding = await prisma.finding.updateMany({ where: { id, workspaceId: session.workspaceId }, data: { ...body, updatedAt: new Date() } });
  if (!finding.count) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await prisma.finding.findUnique({ where: { id } });
  await writeAuditLog({ workspaceId: session.workspaceId, actorId: session.userId, action: "FINDING_UPDATED", targetType: "Finding", targetId: id, targetLabel: updated?.title });

  return NextResponse.json(updated);
}
