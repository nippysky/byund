import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { writeAuditLog } from "@/lib/audit";
import { unlink } from "fs/promises";
import { can } from "@/lib/permissions";
import type { Role } from "@/lib/permissions";

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!can(session.role as Role, "evidence:delete")) {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
  }

  const { id } = await params;

  const evidence = await prisma.evidence.findFirst({
    where: { id, workspaceId: session.workspaceId },
  });
  if (!evidence) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Remove file from disk (best-effort)
  try { await unlink(evidence.filePath); } catch { /* file may already be missing */ }

  await prisma.evidence.delete({ where: { id } });

  await writeAuditLog({
    workspaceId: session.workspaceId,
    actorId: session.userId,
    action: "EVIDENCE_DELETED",
    targetType: "Evidence",
    targetId: id,
    targetLabel: evidence.fileName,
  });

  return NextResponse.json({ deleted: true });
}
