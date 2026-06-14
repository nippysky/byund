import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import * as XLSX from "xlsx";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const assets = await prisma.asset.findMany({
    where: { workspaceId: session.workspaceId, archivedAt: null },
    orderBy: { createdAt: "desc" },
  });

  const rows = assets.map((a: (typeof assets)[number]) => ({
    "Name":            a.name,
    "Type":            a.type.replace(/_/g, " "),
    "Criticality":     a.criticality,
    "Environment":     a.environment ?? "",
    "Description":     a.description ?? "",
    "Review Cycle":    `${a.reviewCycleDays} days`,
    "Last Reviewed":   a.lastReviewedAt ? new Date(a.lastReviewedAt).toLocaleDateString("en-GB") : "Never",
    "Next Review Due": a.nextReviewDue  ? new Date(a.nextReviewDue).toLocaleDateString("en-GB")  : "Not scheduled",
    "Registered":      new Date(a.createdAt).toLocaleDateString("en-GB"),
  }));

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(rows);
  ws["!cols"] = [20,14,12,14,30,14,14,14,14].map((w: number) => ({ wch: w }));
  XLSX.utils.book_append_sheet(wb, ws, "Assets");

  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

  return new NextResponse(buf, {
    headers: {
      "Content-Type":        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="byund-assets-${new Date().toISOString().slice(0,10)}.xlsx"`,
    },
  });
}
