import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import * as XLSX from "xlsx";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const findings = await prisma.finding.findMany({
    where: { workspaceId: session.workspaceId },
    include: {
      asset:    { select: { name: true } },
      assignee: { select: { name: true } },
    },
    orderBy: [{ status: "asc" }, { severity: "desc" }],
  });

  const rows = findings.map((f: (typeof findings)[number]) => ({
    "Title":       f.title,
    "Severity":    f.severity,
    "Status":      f.status.replace(/_/g, " "),
    "Asset":       f.asset?.name ?? "",
    "Assignee":    f.assignee?.name ?? "",
    "Description": f.description ?? "",
    "Resolution":  f.resolution ?? "",
    "Resolved At": f.resolvedAt ? new Date(f.resolvedAt).toLocaleDateString("en-GB") : "",
    "Created":     new Date(f.createdAt).toLocaleDateString("en-GB"),
  }));

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(rows);
  ws["!cols"] = [30,10,14,18,16,40,40,14,14].map((w: number) => ({ wch: w }));
  XLSX.utils.book_append_sheet(wb, ws, "Findings");

  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

  return new NextResponse(buf, {
    headers: {
      "Content-Type":        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="byund-findings-${new Date().toISOString().slice(0,10)}.xlsx"`,
    },
  });
}
