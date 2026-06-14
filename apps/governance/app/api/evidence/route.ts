import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { writeAuditLog } from "@/lib/audit";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const evidence = await prisma.evidence.findMany({
    where: { workspaceId: session.workspaceId },
    include: {
      uploadedBy: { select: { id: true, name: true } },
      asset:      { select: { name: true } },
      review:     { select: { id: true, asset: { select: { name: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(evidence);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData   = await req.formData();
  const file       = formData.get("file") as File;
  const assetId    = formData.get("assetId") as string | null;
  const reviewId   = formData.get("reviewId") as string | null;
  const findingId  = formData.get("findingId") as string | null;
  const description = formData.get("description") as string | null;

  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
  if (file.size > 10 * 1024 * 1024) return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 });

  const uploadDir = path.join(process.cwd(), "uploads", session.workspaceId);
  await mkdir(uploadDir, { recursive: true });
  const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  const filePath = path.join(uploadDir, safeName);
  await writeFile(filePath, Buffer.from(await file.arrayBuffer()));

  const evidence = await prisma.evidence.create({
    data: {
      workspaceId: session.workspaceId,
      uploaderId:  session.userId,
      fileName:    file.name,
      filePath,
      mimeType:    file.type || "application/octet-stream",
      fileSize:    file.size,
      description: description || null,
      assetId:     assetId  || null,
      reviewId:    reviewId  || null,
      findingId:   findingId || null,
    },
  });

  await writeAuditLog({
    workspaceId: session.workspaceId, actorId: session.userId,
    action: "EVIDENCE_UPLOADED", targetType: "Evidence",
    targetId: evidence.id, targetLabel: file.name,
  });

  return NextResponse.json(evidence, { status: 201 });
}
