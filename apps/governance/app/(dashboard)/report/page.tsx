"use client";
import { useState } from "react";
import { toast } from "sonner";
import Topbar from "@/components/layout/Topbar";
import { FileDown, CheckCircle, AlertTriangle, Server, ClipboardCheck, Shield } from "lucide-react";

export default function ReportPage() {
  const [generating, setGenerating] = useState(false);

  const downloadPDF = async () => {
    setGenerating(true);
    try {
      const res  = await fetch("/api/export/report");
      const data = await res.json();
      if (data.error) { toast.error(data.error); setGenerating(false); return; }

      const { jsPDF } = (await import("jspdf")).default
        ? await import("jspdf")
        : await import("jspdf");
      const autoTable = (await import("jspdf-autotable")).default;

      const doc = new (await import("jspdf")).jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const W = doc.internal.pageSize.getWidth();
      let y = 20;

      // Header
      doc.setFillColor(114, 96, 251);
      doc.rect(0, 0, W, 30, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18); doc.setFont("helvetica", "bold");
      doc.text("BYUND GOVERNANCE", 14, 14);
      doc.setFontSize(10); doc.setFont("helvetica", "normal");
      doc.text(`IT Governance Report · ${data.workspace?.name ?? ""}`, 14, 22);
      doc.text(`Generated: ${new Date(data.generatedAt).toLocaleDateString("en-GB", { day:"numeric", month:"long", year:"numeric" })}`, W - 14, 22, { align: "right" });

      y = 40;
      doc.setTextColor(0, 0, 0);

      // Summary stats
      const openFindings = data.findings?.filter((f: any) => f.status === "OPEN").length ?? 0;
      const critFindings = data.findings?.filter((f: any) => f.severity === "CRITICAL").length ?? 0;
      const stats = [
        { label: "Total Assets",      value: data.assets?.length ?? 0 },
        { label: "Open Findings",     value: openFindings },
        { label: "Critical Findings", value: critFindings },
        { label: "Reviews (recent)",  value: data.reviews?.length ?? 0 },
      ];
      const boxW = (W - 28 - 12) / 4;
      stats.forEach((s, i) => {
        const x = 14 + i * (boxW + 4);
        doc.setFillColor(245, 247, 255);
        doc.roundedRect(x, y, boxW, 20, 2, 2, "F");
        doc.setFontSize(18); doc.setFont("helvetica", "bold");
        doc.setTextColor(114, 96, 251);
        doc.text(String(s.value), x + boxW / 2, y + 11, { align: "center" });
        doc.setFontSize(8); doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 100, 120);
        doc.text(s.label, x + boxW / 2, y + 17, { align: "center" });
      });
      y += 28;

      // Assets table
      if (data.assets?.length) {
        doc.setFontSize(12); doc.setFont("helvetica", "bold"); doc.setTextColor(0, 0, 0);
        doc.text("Asset Registry", 14, y); y += 6;
        autoTable(doc, {
          startY: y,
          head: [["Asset Name", "Type", "Criticality", "Environment", "Next Review"]],
          body: data.assets.map((a: any) => [
            a.name,
            a.type.replace(/_/g, " "),
            a.criticality,
            a.environment ?? "—",
            a.nextReviewDue ? new Date(a.nextReviewDue).toLocaleDateString("en-GB") : "Not scheduled",
          ]),
          styles: { fontSize: 9, cellPadding: 3 },
          headStyles: { fillColor: [114, 96, 251], textColor: 255, fontStyle: "bold" },
          alternateRowStyles: { fillColor: [248, 249, 255] },
          columnStyles: { 2: { fontStyle: "bold" } },
        });
        y = (doc as any).lastAutoTable.finalY + 10;
      }

      // Findings table
      if (data.findings?.length) {
        if (y > 220) { doc.addPage(); y = 20; }
        doc.setFontSize(12); doc.setFont("helvetica", "bold"); doc.setTextColor(0, 0, 0);
        doc.text("Findings", 14, y); y += 6;
        autoTable(doc, {
          startY: y,
          head: [["Title", "Severity", "Status", "Asset", "Created"]],
          body: data.findings.map((f: any) => [
            f.title,
            f.severity,
            f.status.replace(/_/g, " "),
            f.asset?.name ?? "—",
            new Date(f.createdAt).toLocaleDateString("en-GB"),
          ]),
          styles: { fontSize: 9, cellPadding: 3 },
          headStyles: { fillColor: [239, 68, 68], textColor: 255, fontStyle: "bold" },
          alternateRowStyles: { fillColor: [255, 248, 248] },
        });
        y = (doc as any).lastAutoTable.finalY + 10;
      }

      // Footer on all pages
      const pageCount = (doc as any).internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8); doc.setTextColor(150, 150, 170);
        doc.text(`BYUND Governance · Confidential · Page ${i} of ${pageCount}`, W / 2, 290, { align: "center" });
      }

      doc.save(`byund-governance-report-${new Date().toISOString().slice(0, 10)}.pdf`);
      toast.success("PDF report downloaded");
    } catch (e) {
      console.error(e);
      toast.error("Failed to generate PDF");
    }
    setGenerating(false);
  };

  const downloadAssetsExcel = () => window.open("/api/export/assets", "_blank");
  const downloadFindingsExcel = () => window.open("/api/export/findings", "_blank");

  return (
    <>
      <Topbar title="Reports & Exports" subtitle="Download compliance reports and data exports"/>
      <div className="app-content" style={{ maxWidth: 700 }}>

        {/* PDF Report */}
        <div className="card" style={{ padding: 28, marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(114,96,251,.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Shield size={22} style={{ color: "var(--brand)" }}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Full Governance Report (PDF)</div>
              <div style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6, marginBottom: 16 }}>
                Complete PDF report including asset registry, findings summary, recent reviews, and audit activity. Ready to share with leadership or auditors.
              </div>
              <button onClick={downloadPDF} disabled={generating} className="btn-primary" style={{ padding: "10px 22px", display: "flex", alignItems: "center", gap: 8 }}>
                <FileDown size={16}/>{generating ? "Generating…" : "Download PDF Report"}
              </button>
            </div>
          </div>
        </div>

        {/* Excel Exports */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <ExportCard
            icon={<Server size={20} style={{ color: "#22c55e" }}/>}
            color="rgba(34,197,94,.1)"
            title="Assets Export"
            desc="All registered assets with review schedules and criticality ratings"
            label="Export Assets (.xlsx)"
            onClick={downloadAssetsExcel}
          />
          <ExportCard
            icon={<AlertTriangle size={20} style={{ color: "#ef4444" }}/>}
            color="rgba(239,68,68,.1)"
            title="Findings Export"
            desc="All findings with severity, status, resolution notes and timeline"
            label="Export Findings (.xlsx)"
            onClick={downloadFindingsExcel}
          />
        </div>

        {/* Info box */}
        <div style={{ marginTop: 24, padding: "14px 18px", background: "var(--surface)", borderRadius: 10, border: "1px solid var(--border)", fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>
          <strong style={{ color: "var(--text)" }}>Note:</strong> All exports reflect current live data from your workspace. PDF is generated client-side in your browser — no data leaves your environment.
        </div>
      </div>
    </>
  );
}

function ExportCard({ icon, color, title, desc, label, onClick }: {
  icon: React.ReactNode; color: string; title: string;
  desc: string; label: string; onClick: () => void;
}) {
  return (
    <div className="card" style={{ padding: 22 }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: color, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
        {icon}
      </div>
      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5, marginBottom: 16 }}>{desc}</div>
      <button onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "1px solid var(--border)", background: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
        <FileDown size={14}/> {label}
      </button>
    </div>
  );
}
