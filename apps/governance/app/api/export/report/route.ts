import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [workspace, assets, findings, reviews, auditLogs] = await Promise.all([
    prisma.workspace.findUnique({ where: { id: session.workspaceId } }),
    prisma.asset.findMany({ where: { workspaceId: session.workspaceId, archivedAt: null }, orderBy: { criticality: "desc" } }),
    prisma.finding.findMany({ where: { workspaceId: session.workspaceId }, orderBy: [{ severity: "desc" }, { status: "asc" }] }),
    prisma.review.findMany({ where: { workspaceId: session.workspaceId }, include: { asset: { select: { name: true } } }, orderBy: { dueAt: "desc" }, take: 20 }),
    prisma.auditLog.findMany({ where: { workspaceId: session.workspaceId }, include: { actor: { select: { name: true } } }, orderBy: { createdAt: "desc" }, take: 50 }),
  ]);

  return NextResponse.json({ workspace, assets, findings, reviews, auditLogs, generatedAt: new Date() });
}
