"use client";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import Topbar from "@/components/layout/Topbar";
import { FileText, Upload, Download, X, Paperclip } from "lucide-react";

interface Asset { id:string; name:string; }
interface Review { id:string; asset?:{ name:string; }; dueAt:string; status:string; }
interface Evidence {
  id:string; fileName:string; fileSize:number; mimeType:string; description?:string; createdAt:string;
  uploadedBy?:{ name:string; };
  asset?:{ name:string; };
  review?:{ id:string; asset?:{name:string}; };
}

export default function EvidencePage() {
  const [items,    setItems]    = useState<Evidence[]>([]);
  const [assets,   setAssets]   = useState<Asset[]>([]);
  const [reviews,  setReviews]  = useState<Review[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [modal,    setModal]    = useState(false);
  const [file,     setFile]     = useState<File|null>(null);
  const [assetId,  setAssetId]  = useState("");
  const [reviewId, setReviewId] = useState("");
  const [desc,     setDesc]     = useState("");
  const [uploading,setUploading]= useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = () => {
    setLoading(true);
    Promise.all([
      fetch("/api/evidence").then(r=>r.json()),
      fetch("/api/assets").then(r=>r.json()),
      fetch("/api/reviews").then(r=>r.json()),
    ]).then(([e,a,rv])=>{ setItems(e); setAssets(a); setReviews(rv.filter((r:any)=>r.status!=="COMPLETED")); })
    .catch(()=>toast.error("Failed to load")).finally(()=>setLoading(false));
  };
  useEffect(()=>{ load(); },[]);

  const upload = async () => {
    if (!file) { toast.error("Select a file first"); return; }
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    if (assetId)  fd.append("assetId", assetId);
    if (reviewId) fd.append("reviewId", reviewId);
    if (desc)     fd.append("description", desc);
    const res = await fetch("/api/evidence",{ method:"POST", body:fd });
    if (res.ok) { toast.success("Evidence uploaded"); setModal(false); setFile(null); setAssetId(""); setReviewId(""); setDesc(""); load(); }
    else { const d=await res.json(); toast.error(d.error??"Upload failed"); }
    setUploading(false);
  };

  const fmt = (n:number) => n<1024?""+n+"B":n<1048576?(n/1024).toFixed(1)+"KB":(n/1048576).toFixed(1)+"MB";

  return (
    <>
      <Topbar title="Evidence" subtitle="Attach and manage compliance evidence" action={{ label:"Upload Evidence", onClick:()=>setModal(true) }}/>
      <div className="app-content">
        <div className="card" style={{padding:0,overflow:"hidden"}}>
          {loading ? <div style={{padding:40,textAlign:"center",color:"var(--text-muted)"}}>Loading evidence…</div>
          : !items.length ? (
            <div style={{padding:"60px 32px",textAlign:"center"}}>
              <FileText size={40} style={{color:"var(--text-muted)",marginBottom:12}}/>
              <div style={{fontWeight:700,fontSize:16,marginBottom:6}}>No evidence uploaded</div>
              <div style={{color:"var(--text-muted)",fontSize:14,marginBottom:20}}>Upload files to support your compliance reviews and audit trail</div>
              <button className="btn-primary" onClick={()=>setModal(true)} style={{padding:"10px 24px"}}>Upload Evidence</button>
            </div>
          ) : (
            <table className="data-table">
              <thead><tr><th>File</th><th>Asset / Review</th><th>Uploaded By</th><th>Size</th><th>Date</th><th style={{textAlign:"right"}}>Download</th></tr></thead>
              <tbody>
                {items.map(e=>(
                  <tr key={e.id}>
                    <td>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <Paperclip size={14} style={{color:"var(--brand)",flexShrink:0}}/>
                        <div>
                          <div style={{fontWeight:600,fontSize:14}}>{e.fileName}</div>
                          {e.description&&<div style={{fontSize:11,color:"var(--text-muted)"}}>{e.description.slice(0,50)}</div>}
                        </div>
                      </div>
                    </td>
                    <td style={{fontSize:13,color:"var(--text-muted)"}}>{e.asset?.name??e.review?.asset?.name??"-"}</td>
                    <td style={{fontSize:13,color:"var(--text-muted)"}}>{e.uploadedBy?.name??"-"}</td>
                    <td style={{fontSize:13,color:"var(--text-muted)"}}>{fmt(e.fileSize)}</td>
                    <td style={{fontSize:13,color:"var(--text-muted)"}}>{new Date(e.createdAt).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}</td>
                    <td>
                      <div style={{display:"flex",justifyContent:"flex-end"}}>
                        <a href={`/api/evidence/${e.id}/download`} target="_blank" style={{background:"none",border:"1px solid var(--border)",borderRadius:6,padding:"5px 10px",color:"var(--brand)",display:"flex",alignItems:"center",gap:4,fontSize:12,fontWeight:600,textDecoration:"none"}}>
                          <Download size={12}/> Download
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {modal && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",backdropFilter:"blur(6px)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div className="card" style={{width:"100%",maxWidth:480,padding:28}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <h3 style={{margin:0,fontWeight:700,fontSize:17}}>Upload Evidence</h3>
              <button onClick={()=>setModal(false)} style={{background:"none",border:"none",cursor:"pointer",color:"var(--text-muted)",display:"flex",padding:4}}><X size={18}/></button>
            </div>
            <div style={{display:"grid",gap:16}}>
              <div
                onClick={()=>fileRef.current?.click()}
                style={{border:`2px dashed ${file?"var(--brand)":"var(--border)"}`,borderRadius:12,padding:32,textAlign:"center",cursor:"pointer",background:file?"rgba(114,96,251,.05)":"none",transition:"all .15s"}}
              >
                {file ? (
                  <>
                    <Paperclip size={24} style={{color:"var(--brand)",marginBottom:8}}/>
                    <div style={{fontWeight:600,fontSize:14}}>{file.name}</div>
                    <div style={{fontSize:12,color:"var(--text-muted)"}}>{fmt(file.size)}</div>
                    <div style={{fontSize:12,color:"var(--brand)",marginTop:8,cursor:"pointer"}} onClick={e=>{e.stopPropagation();setFile(null);}}>Remove</div>
                  </>
                ) : (
                  <>
                    <Upload size={28} style={{color:"var(--text-muted)",marginBottom:10}}/>
                    <div style={{fontWeight:600,fontSize:14,marginBottom:4}}>Drop file here or click to browse</div>
                    <div style={{fontSize:12,color:"var(--text-muted)"}}>PDF, PNG, JPG, DOCX, XLSX — max 10MB</div>
                  </>
                )}
                <input ref={fileRef} type="file" style={{display:"none"}} onChange={e=>setFile(e.target.files?.[0]??null)}/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <div>
                  <label style={lbl}>Asset (optional)</label>
                  <select value={assetId} onChange={e=>setAssetId(e.target.value)} style={inp}>
                    <option value="">— None —</option>
                    {assets.map(a=><option key={a.id} value={a.id}>{a.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={lbl}>Review (optional)</label>
                  <select value={reviewId} onChange={e=>setReviewId(e.target.value)} style={inp}>
                    <option value="">— None —</option>
                    {reviews.map(r=><option key={r.id} value={r.id}>{r.asset?.name ?? new Date(r.dueAt).toLocaleDateString("en-GB")}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={lbl}>Description (optional)</label>
                <input value={desc} onChange={e=>setDesc(e.target.value)} placeholder="e.g. SSL certificate renewal confirmation" style={inp}/>
              </div>
              <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
                <button onClick={()=>setModal(false)} style={{padding:"10px 20px",borderRadius:8,border:"1px solid var(--border)",background:"none",color:"var(--text)",cursor:"pointer",fontWeight:600}}>Cancel</button>
                <button onClick={upload} disabled={uploading||!file} className="btn-primary" style={{padding:"10px 24px"}}>
                  {uploading?"Uploading…":"Upload File"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const lbl: React.CSSProperties = { display:"block",fontSize:13,fontWeight:600,marginBottom:6 };
const inp: React.CSSProperties = { width:"100%",padding:"10px 12px",borderRadius:8,border:"1px solid var(--border)",background:"var(--surface)",color:"var(--text)",fontSize:14,boxSizing:"border-box" };
