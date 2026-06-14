import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

/** Derives real-time notifications from DB state — no extra table needed */
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const ws = session.workspaceId;
  const now = new Date();

  const [overdueReviews, criticalFindings, upcomingReviews, recentResolved] = await Promise.all([
    prisma.review.findMany({
      where: { workspaceId: ws, status: "OVERDUE" },
      include: { asset: { select: { name: true } } },
      take: 5, orderBy: { dueAt: "asc" },
    }),
    prisma.finding.findMany({
      where: { workspaceId: ws, severity: "CRITICAL", status: { in: ["OPEN", "IN_PROGRESS"] } },
      take: 5, orderBy: { createdAt: "desc" },
    }),
    prisma.review.findMany({
      where: {
        workspaceId: ws, status: "DUE",
        dueAt: { lte: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000) },
      },
      include: { asset: { select: { name: true } } },
      take: 3, orderBy: { dueAt: "asc" },
    }),
    prisma.finding.findMany({
      where: { workspaceId: ws, status: "RESOLVED", resolvedAt: { gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) } },
      take: 3, orderBy: { resolvedAt: "desc" },
    }),
  ]);

  const notifications = [
    ...overdueReviews.map(r => ({
      id: `overdue-${r.id}`,
      type: "overdue_review" as const,
      title: "Overdue Review",
      body: `Review for ${r.asset.name} is overdue`,
      href: "/reviews",
      createdAt: r.dueAt.toISOString(),
      read: false,
    })),
    ...criticalFindings.map(f => ({
      id: `critical-${f.id}`,
      type: "critical_finding" as const,
      title: "Critical Finding Open",
      body: f.title,
      href: "/findings",
      createdAt: f.createdAt.toISOString(),
      read: false,
    })),
    ...upcomingReviews.map(r => ({
      id: `upcoming-${r.id}`,
      type: "upcoming_review" as const,
      title: "Review Due Soon",
      body: `${r.asset.name} review due in < 3 days`,
      href: "/reviews",
      createdAt: r.dueAt.toISOString(),
      read: false,
    })),
    ...recentResolved.map(f => ({
      id: `resolved-${f.id}`,
      type: "finding_resolved" as const,
      title: "Finding Resolved",
      body: f.title,
      href: "/findings",
      createdAt: (f.resolvedAt ?? f.updatedAt).toISOString(),
      read: true,
    })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return NextResponse.json({ notifications });
}
