import prisma from "./prisma";

export async function writeAuditLog(params: {
  workspaceId: string;
  actorId?: string;
  action: string;
  targetType?: string;
  targetId?: string;
  targetLabel?: string;
  metadata?: Record<string, unknown>;
}) {
  try {
    await prisma.auditLog.create({
      data: {
        workspaceId:  params.workspaceId,
        actorId:      params.actorId ?? null,
        action:       params.action,
        targetType:   params.targetType ?? null,
        targetId:     params.targetId ?? null,
        targetLabel:  params.targetLabel ?? null,
        metadata:     params.metadata ?? null,
      },
    });
  } catch {
    // Audit log failures should never break the main operation
  }
}
