import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { writeAuditLog } from "@/lib/audit";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const members = await prisma.workspaceMember.findMany({
    where: { workspaceId: session.workspaceId },
    include: { user: { select: { id: true, name: true, email: true, avatarUrl: true } } },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(members);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, email, role = "ANALYST" } = await req.json();
  if (!name || !email) return NextResponse.json({ error: "Name and email required" }, { status: 400 });

  const validRoles = ["ADMIN", "ANALYST", "VIEWER"];
  if (!validRoles.includes(role)) return NextResponse.json({ error: "Invalid role" }, { status: 400 });

  const tempPassword = Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 6).toUpperCase();
  const passwordHash = await bcrypt.hash(tempPassword, 12);

  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    user = await prisma.user.create({ data: { name, email, passwordHash } });
  }

  const existing = await prisma.workspaceMember.findFirst({
    where: { workspaceId: session.workspaceId, userId: user.id },
  });
  if (existing) return NextResponse.json({ error: "User is already a member" }, { status: 409 });

  const member = await prisma.workspaceMember.create({
    data: { workspaceId: session.workspaceId, userId: user.id, role },
    include: { user: { select: { id: true, name: true, email: true } } },
  });

  await writeAuditLog({
    workspaceId: session.workspaceId, actorId: session.userId,
    action: "MEMBER_INVITED", targetType: "User",
    targetId: user.id, targetLabel: email,
  });

  return NextResponse.json({ member, tempPassword }, { status: 201 });
}
