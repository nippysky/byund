"use client";
import { useCallback, useEffect, useState } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  Upload, FileText, FileImage, FileArchive, File as FileIcon,
  Download, Trash2, X, Search, Filter, Plus, Loader2, CheckCircle2,
} from "lucide-react";
import Topbar from "@/components/layout/Topbar";
import PermissionGuard from "@/components/ui/PermissionGuard";

interface Evidence {
  id: string; fileName: string; mimeType: string; fileSize: number;
  description: string | null; createdAt: string;
  uploadedBy: { id: string; name: string };
  asset: { name: string } | null;
  review: { id: string; asset: { name: string } | null } | null;
}
interface Asset  { id: string; name: string; }
interface Review { id: string; dueAt: string; asset?: { name: string } | null; }

const MAX_MB = 10 * 1024 * 1024;

function fileIcon(mime: string) {
  if (mime.startsWith("image/")) return FileImage;
  if (mime === "application/pdf") return FileText;
  if (mime.includes("zip") || mime.includes("compressed")) return FileArchive;
  return FileIcon;
}
function fmtSize(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1024 / 1024).toFixed(1)} MB`;
}

export default function EvidencePage() {
  const [items,   setItems]   = useState<Evidence[]>([]);
  const [assets,  setAssets]  = useState<Asset[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState("");
  const [files,   setFiles]   = useState<File[]>([]);
  const [desc,    setDesc]    = useState("");
  const [assetId, setAssetId] = useState("");
  const [reviewId,setReviewId]= useState("");
  const [uploading, setUploading] = useState(false);
  const [progress,  setProgress]  = useState<Record<string, number>>({});

  const load = useCallback(async () => {
    setLoading(true);
    const [ev, as, rv] = await Promise.all([
      fetch("/api/evidence").then(r => r.json()),
      fetch("/api/assets").then(r => r.json()),
      fetch("/api/reviews").then(r => r.json()),
    ]);
    setItems(Array.isArray(ev) ? ev : []);
    setAssets(Array.isArray(as) ? as : []);
    setReviews(Array.isArray(rv) ? rv : []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const onDrop = useCallback((accepted: File[], rejected: FileRejection[]) => {
    rejected.forEach(({ file, errors }) => toast.error(`${file.name}: ${errors[0]?.message ?? "Rejected"}`));
    setFiles(prev => [...prev, ...accepted]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, maxSize: MAX_MB, noClick: false,
    accept: { "image/*": [], "application/pdf": [], "text/*": [], "application/zip": [], "application/vnd.openxmlformats-officedocument.*": [], "application/msword": [] },
  });

  const handleUpload = async () => {
    if (!files.length) { toast.error("Select at least one file"); return; }
    setUploading(true);
    for (const file of files) {
      setProgress(p => ({ ...p, [file.name]: 10 }));
      const fd = new FormData();
      fd.append("file", file);
      if (desc)     fd.append("description", desc);
      if (assetId)  fd.append("assetId",     assetId);
      if (reviewId) fd.append("reviewId",    reviewId);
      const ticker = setInterval(() => setProgress(p => ({ ...p, [file.name]: Math.min((p[file.name] ?? 10) + 12, 88) })), 120);
      const res = await fetch("/api/evidence", { method: "POST", body: fd });
      clearInterval(ticker);
      setProgress(p => ({ ...p, [file.name]: 100 }));
      if (!res.ok) { const d = await res.json().catch(() => ({})); toast.error(`${file.name}: ${d.error ?? "Upload failed"}`); }
      else toast.success(`Uploaded ${file.name}`);
    }
    setUploading(false); setFiles([]); setDesc(""); setAssetId(""); setReviewId(""); setProgress({});
    load();
  };

  const handleDelete = async (ev: Evidence) => {
    if (!confirm(`Delete "${ev.fileName}"? Cannot be undone.`)) return;
    const id = toast.loading("Deleting…");
    const res = await fetch(`/api/evidence/${ev.id}`, { method: "DELETE" });
    toast.dismiss(id);
    if (res.ok) { toast.success("Deleted"); setItems(p => p.filter(e => e.id !== ev.id)); }
    else toast.error("Delete failed");
  };

  const filtered = items.filter(e =>
    !search ||
    e.fileName.toLowerCase().includes(search.toLowerCase()) ||
    (e.description ?? "").toLowerCase().includes(search.toLowerCase()) ||
    (e.asset?.name ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
      <Topbar title="Evidence" subtitle="Upload and manage audit evidence linked to assets, reviews and findings" />
      <div className="app-content">

        {/* ── Dropzone ── */}
        <div
          {...getRootProps()}
          style={{
            marginBottom: 20, padding: isDragActive ? "38px 24px" : "24px",
            border: `2px dashed ${isDragActive ? "var(--brand)" : "var(--border-med)"}`,
            borderRadius: 16, background: isDragActive ? "var(--brand-sub)" : "transparent",
            display: "flex", alignItems: "center", gap: 16, cursor: "pointer", transition: "all 0.2s",
          }}
        >
          <input {...getInputProps()} />
          <div style={{ width: 46, height: 46, borderRadius: 12, background: isDragActive ? "var(--brand-sub)" : "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Upload size={20} style={{ color: isDragActive ? "var(--brand)" : "var(--text-muted)" }} />
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: isDragActive ? "var(--brand)" : "var(--text-1)", margin: 0 }}>
              {isDragActive ? "Drop files here…" : "Drag & drop files here, or click to browse"}
            </p>
            <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "4px 0 0" }}>PDF, images, Word, Excel, ZIP — max 10 MB per file</p>
          </div>
        </div>

        {/* ── Upload queue ── */}
        {files.length > 0 && (
          <div className="card" style={{ marginBottom: 20, padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <span style={{ fontWeight: 700, fontSize: 14 }}>{files.length} file{files.length !== 1 ? "s" : ""} ready to upload</span>
              <button onClick={() => { setFiles([]); setProgress({}); }} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}><X size={16} /></button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
              {files.map(f => {
                const Icon = fileIcon(f.type);
                const pct  = progress[f.name] ?? -1;
                return (
                  <div key={f.name} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "var(--surface-2)", borderRadius: 10 }}>
                    <Icon size={16} style={{ color: "var(--brand-hi)", flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</p>
                      <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0 }}>{fmtSize(f.size)}</p>
                      {pct >= 0 && (
                        <div style={{ marginTop: 5, height: 3, borderRadius: 100, background: "var(--surface-3)" }}>
                          <div style={{ height: "100%", borderRadius: 100, width: `${pct}%`, background: pct === 100 ? "#22c55e" : "var(--brand)", transition: "width 0.15s" }} />
                        </div>
                      )}
                    </div>
                    {pct === 100
                      ? <CheckCircle2 size={14} style={{ color: "#22c55e", flexShrink: 0 }} />
                      : <button onClick={() => setFiles(p => p.filter(x => x.name !== f.name))} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 0 }}><X size={13} /></button>
                    }
                  </div>
                );
              })}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
              <div>
                <label className="label-text">Description (optional)</label>
                <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="e.g. Q2 SSL audit report" className="input" style={{ fontSize: 13 }} />
              </div>
              <div>
                <label className="label-text">Link to Asset</label>
                <select value={assetId} onChange={e => setAssetId(e.target.value)} className="input" style={{ fontSize: 13 }}>
                  <option value="">— None —</option>
                  {assets.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
              <div>
                <label className="label-text">Link to Review</label>
                <select value={reviewId} onChange={e => setReviewId(e.target.value)} className="input" style={{ fontSize: 13 }}>
                  <option value="">— None —</option>
                  {reviews.map(r => <option key={r.id} value={r.id}>{r.asset?.name ?? "Review"} · {format(new Date(r.dueAt), "d MMM")}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={handleUpload} disabled={uploading} className="btn-primary btn-md" style={{ display: "flex", alignItems: "center", gap: 7 }}>
                {uploading ? <Loader2 size={14} style={{ animation: "spin .8s linear infinite" }} /> : <Upload size={14} />}
                {uploading ? "Uploading…" : `Upload ${files.length} file${files.length !== 1 ? "s" : ""}`}
              </button>
              <button onClick={() => { setFiles([]); setProgress({}); }} disabled={uploading}
                style={{ padding: "9px 16px", borderRadius: 9, background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text-2)", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "inherit" }}>
                Clear
              </button>
            </div>
          </div>
        )}

        {/* ── Search bar ── */}
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <div style={{ position: "relative", flex: 1 }}>
            <Search size={13} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search files, descriptions, linked assets…" className="input" style={{ paddingLeft: 36, fontSize: 13 }} />
            {search && <button onClick={() => setSearch("")} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}><X size={13} /></button>}
          </div>
          <div style={{ fontSize: 13, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 6, padding: "0 14px", background: "var(--surface-1)", border: "1px solid var(--border)", borderRadius: 9 }}>
            <Filter size={13} /> {filtered.length} file{filtered.length !== 1 ? "s" : ""}
          </div>
        </div>

        {/* ── Table ── */}
        <div className="card">
          {loading ? (
            <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 10 }}>
              {Array(5).fill(0).map((_, i) => (
                <div key={i} style={{ height: 52, borderRadius: 9, background: "var(--surface-2)", animation: `pulse 1.5s ${i * 80}ms ease-in-out infinite` }} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: "60px 24px", textAlign: "center" }}>
              <Upload size={32} style={{ color: "var(--text-muted)", margin: "0 auto 12px", display: "block" }} />
              <p style={{ fontSize: 15, fontWeight: 700, color: "var(--text-1)", margin: "0 0 6px" }}>
                {search ? `No files match "${search}"` : "No evidence files yet"}
              </p>
              <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "0 0 20px" }}>Drag files onto this page to upload them instantly</p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr><th>File</th><th>Linked To</th><th>Uploaded By</th><th>Date</th><th style={{ width: 100 }}>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.map(ev => {
                  const Icon = fileIcon(ev.mimeType);
                  return (
                    <tr key={ev.id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 34, height: 34, borderRadius: 9, background: "var(--brand-sub)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <Icon size={15} style={{ color: "var(--brand-hi)" }} />
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 13 }}>{ev.fileName}</div>
                            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{fmtSize(ev.fileSize)}{ev.description ? ` · ${ev.description}` : ""}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        {ev.asset
                          ? <span style={{ fontSize: 12, padding: "3px 9px", borderRadius: 6, background: "var(--brand-sub)", color: "var(--brand-hi)", fontWeight: 600 }}>{ev.asset.name}</span>
                          : ev.review
                            ? <span style={{ fontSize: 12, padding: "3px 9px", borderRadius: 6, background: "rgba(59,130,246,0.1)", color: "#60a5fa", fontWeight: 600 }}>{ev.review.asset?.name ?? "Review"}</span>
                            : <span style={{ fontSize: 12, color: "var(--text-muted)" }}>—</span>
                        }
                      </td>
                      <td style={{ fontSize: 13 }}>{ev.uploadedBy.name}</td>
                      <td style={{ fontSize: 12, color: "var(--text-muted)" }}>{format(new Date(ev.createdAt), "d MMM yyyy")}</td>
                      <td>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button title="Download" onClick={() => window.open(`/api/evidence/${ev.id}/download`, "_blank")}
                            style={{ width: 30, height: 30, borderRadius: 7, background: "var(--surface-2)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--text-muted)" }}>
                            <Download size={13} />
                          </button>
                          <PermissionGuard action="evidence:delete">
                            <button title="Delete" onClick={() => handleDelete(ev)}
                              style={{ width: 30, height: 30, borderRadius: 7, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#ef4444" }}>
                              <Trash2 size={13} />
                            </button>
                          </PermissionGuard>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
