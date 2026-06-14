import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { id: session.userId }, select: { id: true, name: true, email: true, avatarUrl: true } });
  const workspace = await prisma.workspace.findUnique({ where: { id: session.workspaceId } });

  return NextResponse.json({ user, workspace, role: session.role });
}
