import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { subDays, format } from "date-fns";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const ws  = session.workspaceId;
  const now = new Date();

  // Core counts
  const [
    totalAssets,
    openFindings,
    criticalFindings,
    completedReviews,
    totalReviews,
    overdueReviews,
    upcomingReviews,
    recentActivity,
    allAssets,
    allOpenFindings,
  ] = await Promise.all([
    prisma.asset.count({ where: { workspaceId: ws, archivedAt: null } }),
    prisma.finding.count({ where: { workspaceId: ws, status: { in: ["OPEN", "IN_PROGRESS"] } } }),
    prisma.finding.count({ where: { workspaceId: ws, severity: "CRITICAL", status: { in: ["OPEN", "IN_PROGRESS"] } } }),
    prisma.review.count({ where: { workspaceId: ws, status: "COMPLETED" } }),
    prisma.review.count({ where: { workspaceId: ws } }),
    prisma.review.count({ where: { workspaceId: ws, status: "OVERDUE" } }),
    prisma.review.findMany({
      where: { workspaceId: ws, status: { in: ["UPCOMING", "DUE", "OVERDUE"] } },
      include: { asset: { select: { name: true, type: true, criticality: true } } },
      orderBy: { dueAt: "asc" },
      take: 6,
    }),
    prisma.auditLog.findMany({
      where: { workspaceId: ws },
      include: { actor: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    // For criticality breakdown
    prisma.asset.findMany({
      where: { workspaceId: ws, archivedAt: null },
      select: { criticality: true },
    }),
    // For severity breakdown
    prisma.finding.findMany({
      where: { workspaceId: ws, status: { in: ["OPEN", "IN_PROGRESS"] } },
      select: { severity: true },
    }),
  ]);

  const dueForReview = await prisma.asset.count({
    where: { workspaceId: ws, archivedAt: null, nextReviewDue: { lte: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000) } },
  });

  const auditCoverage = totalAssets > 0 ? Math.round((completedReviews / Math.max(totalReviews, 1)) * 100) : 0;

  // Asset criticality breakdown for pie chart
  const critCounts = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
  for (const a of allAssets) {
    const k = a.criticality as keyof typeof critCounts;
    if (k in critCounts) critCounts[k]++;
  }
  const CRIT_COLORS = { CRITICAL: "#ef4444", HIGH: "#f97316", MEDIUM: "#f59e0b", LOW: "#6b7280" };
  const assetsByCriticality = (Object.entries(critCounts) as [keyof typeof critCounts, number][])
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({ name, value, color: CRIT_COLORS[name] }));

  // Findings by severity for bar chart
  const sevCounts = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
  for (const f of allOpenFindings) {
    const k = f.severity as keyof typeof sevCounts;
    if (k in sevCounts) sevCounts[k]++;
  }
  const SEV_COLORS = { CRITICAL: "#ef4444", HIGH: "#f97316", MEDIUM: "#f59e0b", LOW: "#6b7280" };
  const findingsBySeverity = (Object.entries(sevCounts) as [keyof typeof sevCounts, number][])
    .map(([name, value]) => ({ name, value, color: SEV_COLORS[name] }));

  // Review trend — last 14 days
  const trend14 = await Promise.all(
    Array.from({ length: 14 }, (_, i) => {
      const day     = subDays(now, 13 - i);
      const dayStart = new Date(day); dayStart.setHours(0, 0, 0, 0);
      const dayEnd   = new Date(day); dayEnd.setHours(23, 59, 59, 999);
      return Promise.all([
        prisma.review.count({ where: { workspaceId: ws, status: "COMPLETED", completedAt: { gte: dayStart, lte: dayEnd } } }),
        prisma.review.count({ where: { workspaceId: ws, scheduledAt: { gte: dayStart, lte: dayEnd } } }),
      ]).then(([completed, created]) => ({
        date: format(day, "dd MMM"),
        completed,
        created,
      }));
    })
  );

  // Risk score: weighted formula
  const riskScore = Math.min(100, Math.round(
    criticalFindings * 15 +
    overdueReviews   * 8 +
    (openFindings - criticalFindings) * 3 +
    Math.max(0, 100 - auditCoverage) * 0.2
  ));

  return NextResponse.json({
    totalAssets,
    dueForReview,
    openFindings,
    criticalFindings,
    auditCoverage,
    overdueReviews,
    riskScore,
    assetsByCriticality,
    findingsBySeverity,
    reviewTrend: trend14,
    upcomingReviews,
    recentActivity,
  });
}
