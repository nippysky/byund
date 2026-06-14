import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { writeAuditLog } from "@/lib/audit";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const member = await prisma.workspaceMember.findFirst({
    where: { id, workspaceId: session.workspaceId },
    include: { user: { select: { name: true } } },
  });
  if (!member) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (member.role === "OWNER") return NextResponse.json({ error: "Cannot change owner role" }, { status: 403 });

  const { role } = await req.json();
  const validRoles = ["ADMIN", "ANALYST", "VIEWER"];
  if (!validRoles.includes(role)) return NextResponse.json({ error: "Invalid role" }, { status: 400 });

  const updated = await prisma.workspaceMember.update({ where: { id }, data: { role } });

  await writeAuditLog({
    workspaceId: session.workspaceId, actorId: session.userId,
    action: "MEMBER_ROLE_CHANGED", targetType: "WorkspaceMember",
    targetId: id, targetLabel: member.user.name,
    metadata: { from: member.role, to: role },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const member = await prisma.workspaceMember.findFirst({
    where: { id, workspaceId: session.workspaceId },
    include: { user: { select: { name: true, email: true } } },
  });
  if (!member) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (member.role === "OWNER") return NextResponse.json({ error: "Cannot remove workspace owner" }, { status: 403 });

  await prisma.workspaceMember.delete({ where: { id } });

  await writeAuditLog({
    workspaceId: session.workspaceId, actorId: session.userId,
    action: "MEMBER_REMOVED", targetType: "User",
    targetId: member.userId, targetLabel: member.user.name,
  });

  return NextResponse.json({ success: true });
}
