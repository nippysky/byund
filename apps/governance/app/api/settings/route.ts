import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { writeAuditLog } from "@/lib/audit";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const settings = await prisma.workspaceSettings.findUnique({
    where: { workspaceId: session.workspaceId },
  });

  // Return defaults if not yet configured
  return NextResponse.json(settings ?? {
    defaultReviewCycleDays: 90,
    autoRaiseFindingsOnMajorIssues: true,
    requireEvidenceForReview: false,
    notifyOnUpcomingReview: true,
    notifyDaysBeforeReview: 7,
  });
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const {
    defaultReviewCycleDays,
    autoRaiseFindingsOnMajorIssues,
    requireEvidenceForReview,
    notifyOnUpcomingReview,
    notifyDaysBeforeReview,
  } = await req.json();

  const settings = await prisma.workspaceSettings.upsert({
    where:  { workspaceId: session.workspaceId },
    update: { defaultReviewCycleDays, autoRaiseFindingsOnMajorIssues, requireEvidenceForReview, notifyOnUpcomingReview, notifyDaysBeforeReview },
    create: { workspaceId: session.workspaceId, defaultReviewCycleDays, autoRaiseFindingsOnMajorIssues, requireEvidenceForReview, notifyOnUpcomingReview, notifyDaysBeforeReview },
  });

  await writeAuditLog({
    workspaceId: session.workspaceId, actorId: session.userId,
    action: "WORKSPACE_UPDATED", targetType: "WorkspaceSettings",
    targetId: session.workspaceId, targetLabel: "Settings",
  });

  return NextResponse.json(settings);
}
