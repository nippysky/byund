import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { createSession, setSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ error: "Email and password required" }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });

    const member = await prisma.workspaceMember.findFirst({
      where: { userId: user.id },
      include: { workspace: true },
      orderBy: { createdAt: "asc" },
    });
    if (!member) return NextResponse.json({ error: "No workspace found for this account" }, { status: 404 });

    const token = await createSession({
      userId: user.id, workspaceId: member.workspaceId,
      role: member.role, name: user.name, email: user.email,
    });

    const res = NextResponse.json({
      user:      { id: user.id, name: user.name, email: user.email },
      workspace: { id: member.workspaceId, name: member.workspace.name, slug: member.workspace.slug },
    });
    setSessionCookie(token, res);
    return res;
  } catch (e) {
    console.error("[login]", e);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
