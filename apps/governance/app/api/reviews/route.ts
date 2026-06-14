import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Auto-update statuses before returning
  const now = new Date();
  await prisma.review.updateMany({
    where: { workspaceId: session.workspaceId, status: "UPCOMING", dueAt: { lte: now } },
    data: { status: "OVERDUE" },
  });
  await prisma.review.updateMany({
    where: {
      workspaceId: session.workspaceId, status: "UPCOMING",
      dueAt: { lte: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000), gt: now },
    },
    data: { status: "DUE" },
  });

  const reviews = await prisma.review.findMany({
    where: { workspaceId: session.workspaceId },
    include: {
      asset:    { select: { id: true, name: true, type: true, criticality: true } },
      assignee: { select: { id: true, name: true, email: true } },
    },
    orderBy: { dueAt: "asc" },
  });

  return NextResponse.json(reviews);
}
