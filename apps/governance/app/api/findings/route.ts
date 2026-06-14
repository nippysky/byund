import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { writeAuditLog } from "@/lib/audit";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const findings = await prisma.finding.findMany({
    where: { workspaceId: session.workspaceId },
    include: {
      asset:    { select: { id: true, name: true } },
      assignee: { select: { id: true, name: true } },
    },
    orderBy: [{ status: "asc" }, { severity: "desc" }, { createdAt: "desc" }],
  });

  return NextResponse.json(findings);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, description, severity, assetId, assigneeId, dueAt } = await req.json();
  if (!title || !severity) return NextResponse.json({ error: "title and severity required" }, { status: 400 });

  const finding = await prisma.finding.create({
    data: {
      workspaceId: session.workspaceId, title, description, severity,
      assetId: assetId || null, assigneeId: assigneeId || null,
      dueAt: dueAt ? new Date(dueAt) : null,
    },
  });

  await writeAuditLog({ workspaceId: session.workspaceId, actorId: session.userId, action: "FINDING_CREATED", targetType: "Finding", targetId: finding.id, targetLabel: finding.title });

  return NextResponse.json(finding, { status: 201 });
}
