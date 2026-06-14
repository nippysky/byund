import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const ws = session.workspaceId;
  const now = new Date();

  const [totalAssets, openFindings, criticalFindings, completedReviews, totalReviews, upcomingReviews, recentActivity] = await Promise.all([
    prisma.asset.count({ where: { workspaceId: ws, archivedAt: null } }),
    prisma.finding.count({ where: { workspaceId: ws, status: { in: ["OPEN", "IN_PROGRESS"] } } }),
    prisma.finding.count({ where: { workspaceId: ws, severity: "CRITICAL", status: { in: ["OPEN", "IN_PROGRESS"] } } }),
    prisma.review.count({ where: { workspaceId: ws, status: "COMPLETED" } }),
    prisma.review.count({ where: { workspaceId: ws } }),
    prisma.review.findMany({
      where: { workspaceId: ws, status: { in: ["UPCOMING", "DUE", "OVERDUE"] }, dueAt: { gte: now } },
      include: { asset: { select: { name: true, criticality: true } }, assignee: { select: { name: true } } },
      orderBy: { dueAt: "asc" },
      take: 5,
    }),
    prisma.auditLog.findMany({
      where: { workspaceId: ws },
      include: { actor: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    prisma.review.count({ where: { workspaceId: ws, status: "OVERDUE" } }),
  ]);

  const dueForReview = await prisma.asset.count({
    where: { workspaceId: ws, archivedAt: null, nextReviewDue: { lte: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000) } },
  });

  const auditCoverage = totalAssets > 0 ? Math.round((completedReviews / Math.max(totalReviews, 1)) * 100) : 0;

  return NextResponse.json({
    totalAssets,
    dueForReview,
    openFindings,
    criticalFindings,
    auditCoverage,
    upcomingReviews,
    recentActivity,
  });
}
