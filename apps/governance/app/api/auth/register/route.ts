import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { createSession, setSessionCookie } from "@/lib/auth";
import { writeAuditLog } from "@/lib/audit";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, workspaceName } = await req.json();

    if (!name || !email || !password || !workspaceName) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return NextResponse.json({ error: "Email already registered" }, { status: 409 });

    const passwordHash = await bcrypt.hash(password, 12);
    const slug = workspaceName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
      + "-" + Date.now().toString(36);

    const { user, workspace } = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({ data: { name, email, passwordHash } });
      const workspace = await tx.workspace.create({
        data: {
          name: workspaceName,
          slug,
          members: { create: { userId: user.id, role: "OWNER" } },
          settings: { create: {} },
        },
      });
      return { user, workspace };
    });

    await writeAuditLog({
      workspaceId: workspace.id, actorId: user.id,
      action: "WORKSPACE_UPDATED", targetType: "Workspace",
      targetId: workspace.id, targetLabel: workspace.name,
      metadata: { event: "workspace_created" },
    });

    const member = await prisma.workspaceMember.findFirst({
      where: { userId: user.id, workspaceId: workspace.id },
    });

    const token = await createSession({
      userId: user.id, workspaceId: workspace.id,
      role: member!.role, name: user.name, email: user.email,
    });

    const res = NextResponse.json({
      user:      { id: user.id, name: user.name, email: user.email },
      workspace: { id: workspace.id, name: workspace.name, slug: workspace.slug },
    }, { status: 201 });
    setSessionCookie(token, res);
    return res;
  } catch (e: any) {
    console.error("[register]", e);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
