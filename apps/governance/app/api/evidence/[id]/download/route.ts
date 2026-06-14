import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { readFile } from "fs/promises";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const evidence = await prisma.evidence.findFirst({
    where: { id, workspaceId: session.workspaceId },
  });
  if (!evidence) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    const buffer = await readFile(evidence.filePath);
    return new NextResponse(buffer, {
      headers: {
        "Content-Type":        evidence.mimeType,
        "Content-Disposition": `attachment; filename="${evidence.fileName}"`,
        "Content-Length":      String(buffer.length),
      },
    });
  } catch {
    return NextResponse.json({ error: "File not found on disk" }, { status: 404 });
  }
}
