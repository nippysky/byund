import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { writeAuditLog } from "@/lib/audit";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const { outcome, notes } = await req.json();
  if (!outcome) return NextResponse.json({ error: "outcome required" }, { status: 400 });

  const review = await prisma.review.findFirst({ where: { id, workspaceId: session.workspaceId }, include: { asset: true } });
  if (!review) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const now = new Date();
  const updated = await prisma.review.update({
    where: { id },
    data: { status: "COMPLETED", outcome, notes, completedAt: now },
  });

  // Update asset's last reviewed + schedule next review
  const nextDue = new Date(now.getTime() + review.asset.reviewCycleDays * 24 * 60 * 60 * 1000);
  await prisma.asset.update({
    where: { id: review.assetId },
    data: { lastReviewedAt: now, nextReviewDue: nextDue },
  });
  await prisma.review.create({
    data: { workspaceId: session.workspaceId, assetId: review.assetId, scheduledAt: now, dueAt: nextDue, status: "UPCOMING" },
  });

  // Auto-raise finding if major issues
  if (outcome === "MAJOR_ISSUES") {
    await prisma.finding.create({
      data: {
        workspaceId: session.workspaceId, assetId: review.assetId, reviewId: id,
        title: `Major issues found in review of ${review.asset.name}`,
        severity: "HIGH", status: "OPEN",
      },
    });
  }

  await writeAuditLog({ workspaceId: session.workspaceId, actorId: session.userId, action: "REVIEW_COMPLETED", targetType: "Review", targetId: id, targetLabel: review.asset.name, metadata: { outcome } });

  return NextResponse.json(updated);
}
