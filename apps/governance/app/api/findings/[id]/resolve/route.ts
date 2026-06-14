import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { writeAuditLog } from "@/lib/audit";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const { resolution } = await req.json();

  const finding = await prisma.finding.findFirst({ where: { id, workspaceId: session.workspaceId } });
  if (!finding) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await prisma.finding.update({
    where: { id },
    data: { status: "RESOLVED", resolution, resolvedAt: new Date(), updatedAt: new Date() },
  });

  await writeAuditLog({ workspaceId: session.workspaceId, actorId: session.userId, action: "FINDING_RESOLVED", targetType: "Finding", targetId: id, targetLabel: finding.title });

  return NextResponse.json(updated);
}
