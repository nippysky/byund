import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const q = new URL(req.url).searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) return NextResponse.json({ results: [] });

  const ws = session.workspaceId;
  const contains = { contains: q, mode: "insensitive" as const };

  const [assets, findings, reviews, members] = await Promise.all([
    prisma.asset.findMany({
      where: {
        workspaceId: ws, archivedAt: null,
        OR: [{ name: contains }, { description: contains }],
      },
      select: { id: true, name: true, type: true, criticality: true },
      take: 5,
    }),
    prisma.finding.findMany({
      where: {
        workspaceId: ws,
        OR: [{ title: contains }, { description: contains }],
      },
      select: { id: true, title: true, severity: true, status: true },
      take: 5,
    }),
    prisma.review.findMany({
      where: { workspaceId: ws, asset: { name: contains } },
      select: { id: true, status: true, dueAt: true, asset: { select: { name: true } } },
      take: 4,
    }),
    prisma.user.findMany({
      where: {
        workspaceMembers: { some: { workspaceId: ws } },
        OR: [{ name: contains }, { email: contains }],
      },
      select: { id: true, name: true, email: true },
      take: 4,
    }),
  ]);

  return NextResponse.json({
    results: {
      assets:   assets.map(a => ({ ...a, _type: "asset"   as const })),
      findings: findings.map(f => ({ ...f, _type: "finding" as const })),
      reviews:  reviews.map(r => ({ ...r, _type: "review"  as const })),
      members:  members.map(m => ({ ...m, _type: "member"  as const })),
    },
  });
}
