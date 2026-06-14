"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Topbar from "@/components/layout/Topbar";
import { AlertTriangle, X, CheckCircle, Plus } from "lucide-react";

type Severity  = "LOW"|"MEDIUM"|"HIGH"|"CRITICAL";
type FindStatus = "OPEN"|"IN_PROGRESS"|"RESOLVED"|"WONT_FIX";

interface Asset { id:string; name:string; }
interface Finding {
  id:string; title:string; description?:string; severity:Severity; status:FindStatus;
  resolution?:string; resolvedAt?:string; createdAt:string;
  asset?:{ name:string; type:string; };
  raisedBy?:{ name:string; };
}

const SEV_CLASS: Record<Severity,string> = { CRITICAL:"badge-danger", HIGH:"badge-warning", MEDIUM:"badge-info", LOW:"badge-success" };
const ST_CLASS: Record<FindStatus,string> = { OPEN:"badge-danger", IN_PROGRESS:"badge-warning", RESOLVED:"badge-success", WONT_FIX:"badge-info" };
const EMPTY_FINDING = { title:"", description:"", severity:"MEDIUM" as Severity, assetId:"" };
const EMPTY_RESOLVE = { resolution:"" };

export default function FindingsPage() {
  const [findings, setFindings] = useState<Finding[]>([]);
  const [assets,   setAssets]   = useState<Asset[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [creating, setCreating] = useState(false);
  const [resolving,setResolving]= useState<Finding|null>(null);
  const [form,     setForm]     = useState(EMPTY_FINDING);
  const [resForm,  setResForm]  = useState(EMPTY_RESOLVE);
  const [saving,   setSaving]   = useState(false);
  const [filter,   setFilter]   = useState<FindStatus|"ALL">("ALL");

  const load = () => {
    setLoading(true);
    Promise.all([
      fetch("/api/findings").then(r=>r.json()),
      fetch("/api/assets").then(r=>r.json()),
    ]).then(([f,a])=>{ setFindings(f); setAssets(a); }).catch(()=>toast.error("Failed to load")).finally(()=>setLoading(false));
  };
  useEffect(()=>{ load(); },[]);

  const createFinding = async () => {
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    setSaving(true);
    const res = await fetch("/api/findings",{ method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(form) });
    if (res.ok) { toast.success("Finding raised"); setCreating(false); setForm(EMPTY_FINDING); load(); }
    else { const d=await res.json(); toast.error(d.error??"Failed"); }
    setSaving(false);
  };

  const resolveFinding = async () => {
    if (!resolving || !resForm.resolution.trim()) { toast.error("Resolution is required"); return; }
    setSaving(true);
    const res = await fetch(`/api/findings/${resolving.id}/resolve`,{ method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(resForm) });
    if (res.ok) { toast.success("Finding resolved"); setResolving(null); setResForm(EMPTY_RESOLVE); load(); }
    else { const d=await res.json(); toast.error(d.error??"Failed"); }
    setSaving(false);
  };

  const updateStatus = async (f:Finding, status:FindStatus) => {
    const res = await fetch(`/api/findings/${f.id}`,{ method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify({status}) });
    if (res.ok) { toast.success("Status updated"); load(); }
    else toast.error("Failed to update");
  };

  const filtered = filter==="ALL" ? findings : findings.filter(f=>f.status===filter);
  const counts = findings.reduce((acc,f)=>{ acc[f.status]=(acc[f.status]??0)+1; return acc; },{} as Record<string,number>);

  return (
    <>
      <Topbar title="Findings" subtitle="Track and resolve compliance issues" action={{ label:"Raise Finding", onClick:()=>{ setForm(EMPTY_FINDING); setCreating(true); } }}/>
      <div className="app-content">
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:20}}>
          {(["ALL","OPEN","IN_PROGRESS","RESOLVED","WONT_FIX"] as const).map(s=>(
            <button key={s} onClick={()=>setFilter(s as any)} style={{padding:"5px 12px",borderRadius:20,border:"none",cursor:"pointer",fontSize:12,fontWeight:600,background:filter===s?"var(--brand)":"var(--surface)",color:filter===s?"#fff":"var(--text-muted)"}}>
              {s==="ALL"?`All (${findings.length})`:s.replace(/_/g," ")}{s!=="ALL"&&counts[s]?` (${counts[s]})`:null}
            </button>
          ))}
        </div>

        <div className="card" style={{padding:0,overflow:"hidden"}}>
          {loading ? <div style={{padding:40,textAlign:"center",color:"var(--text-muted)"}}>Loading findings…</div>
          : !filtered.length ? (
            <div style={{padding:"60px 32px",textAlign:"center"}}>
              <AlertTriangle size={40} style={{color:"var(--text-muted)",marginBottom:12}}/>
              <div style={{fontWeight:700,fontSize:16,marginBottom:6}}>{filter==="ALL"?"No findings raised":"No findings with this status"}</div>
              {filter==="ALL"&&<div style={{color:"var(--text-muted)",fontSize:14,marginBottom:20}}>Findings are raised when reviews uncover issues</div>}
              {filter==="ALL"&&<button className="btn-primary" onClick={()=>{setForm(EMPTY_FINDING);setCreating(true);}} style={{padding:"10px 24px"}}>Raise Finding</button>}
            </div>
          ) : (
            <table className="data-table">
              <thead><tr><th>Finding</th><th>Asset</th><th>Severity</th><th>Status</th><th>Raised</th><th style={{textAlign:"right"}}>Action</th></tr></thead>
              <tbody>
                {filtered.map(f=>(
                  <tr key={f.id}>
                    <td>
                      <div style={{fontWeight:600,fontSize:14,maxWidth:260}}>{f.title}</div>
                      {f.description&&<div style={{fontSize:11,color:"var(--text-muted)",marginTop:2}}>{f.description.slice(0,60)}{f.description.length>60?"…":""}</div>}
                    </td>
                    <td style={{fontSize:13,color:"var(--text-muted)"}}>{f.asset?.name??"-"}</td>
                    <td><span className={SEV_CLASS[f.severity]}>{f.severity}</span></td>
                    <td><span className={ST_CLASS[f.status]}>{f.status.replace(/_/g," ")}</span></td>
                    <td style={{fontSize:13,color:"var(--text-muted)"}}>{new Date(f.createdAt).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}</td>
                    <td>
                      <div style={{display:"flex",gap:6,justifyContent:"flex-end"}}>
                        {f.status==="OPEN" && (
                          <button onClick={()=>updateStatus(f,"IN_PROGRESS")} style={{background:"none",border:"1px solid var(--border)",borderRadius:6,padding:"5px 10px",cursor:"pointer",color:"#f59e0b",fontSize:12,fontWeight:600}}>
                            Start
                          </button>
                        )}
                        {(f.status==="OPEN"||f.status==="IN_PROGRESS") && (
                          <button onClick={()=>{setResForm(EMPTY_RESOLVE);setResolving(f);}} style={{background:"none",border:"1px solid var(--border)",borderRadius:6,padding:"5px 10px",cursor:"pointer",color:"#22c55e",display:"flex",alignItems:"center",gap:4,fontSize:12,fontWeight:600}}>
                            <CheckCircle size={12}/> Resolve
                          </button>
                        )}
                        {f.status==="RESOLVED"&&f.resolvedAt&&<span style={{fontSize:12,color:"var(--text-muted)"}}>{new Date(f.resolvedAt).toLocaleDateString("en-GB",{day:"numeric",month:"short"})}</span>}
                        {f.status==="WONT_FIX"&&<span style={{fontSize:12,color:"var(--text-muted)"}}>Closed</span>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Create Finding Modal */}
      {creating && (
        <Modal title="Raise Finding" onClose={()=>setCreating(false)}>
          <div style={{display:"grid",gap:16}}>
            <div>
              <label style={lbl}>Title *</label>
              <input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="e.g. SSL certificate expiring in 7 days" style={inp}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div>
                <label style={lbl}>Severity</label>
                <select value={form.severity} onChange={e=>setForm(f=>({...f,severity:e.target.value as Severity}))} style={inp}>
                  {["LOW","MEDIUM","HIGH","CRITICAL"].map(s=><option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={lbl}>Asset (optional)</label>
                <select value={form.assetId} onChange={e=>setForm(f=>({...f,assetId:e.target.value}))} style={inp}>
                  <option value="">— None —</option>
                  {assets.map(a=><option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label style={lbl}>Description</label>
              <textarea value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} rows={4} placeholder="Describe the issue in detail…" style={{...inp,resize:"vertical"}}/>
            </div>
            <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
              <button onClick={()=>setCreating(false)} style={cancelBtn}>Cancel</button>
              <button onClick={createFinding} disabled={saving} className="btn-primary" style={{padding:"10px 24px"}}>{saving?"Saving…":"Raise Finding"}</button>
            </div>
          </div>
        </Modal>
      )}

      {/* Resolve Modal */}
      {resolving && (
        <Modal title="Resolve Finding" onClose={()=>setResolving(null)}>
          <div style={{marginBottom:16,padding:"12px 14px",background:"var(--surface)",borderRadius:8}}>
            <div style={{fontWeight:600,fontSize:14}}>{resolving.title}</div>
            <span className={SEV_CLASS[resolving.severity]} style={{marginTop:4,display:"inline-block"}}>{resolving.severity}</span>
          </div>
          <div style={{display:"grid",gap:16}}>
            <div>
              <label style={lbl}>Resolution Summary *</label>
              <textarea value={resForm.resolution} onChange={e=>setResForm(f=>({...f,resolution:e.target.value}))} rows={5} placeholder="Describe how this was resolved, what changes were made, and evidence of remediation…" style={{...inp,resize:"vertical"}}/>
            </div>
            <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
              <button onClick={()=>setResolving(null)} style={cancelBtn}>Cancel</button>
              <button onClick={resolveFinding} disabled={saving} className="btn-primary" style={{padding:"10px 24px"}}>{saving?"Saving…":"Mark Resolved"}</button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

function Modal({title,children,onClose}:{title:string;children:React.ReactNode;onClose:()=>void}) {
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",backdropFilter:"blur(6px)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div className="card" style={{width:"100%",maxWidth:520,padding:28,maxHeight:"90vh",overflowY:"auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <h3 style={{margin:0,fontWeight:700,fontSize:17}}>{title}</h3>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:"var(--text-muted)",display:"flex",padding:4}}><X size={18}/></button>
        </div>
        {children}
      </div>
    </div>
  );
}

const lbl: React.CSSProperties = { display:"block",fontSize:13,fontWeight:600,marginBottom:6 };
const inp: React.CSSProperties = { width:"100%",padding:"10px 12px",borderRadius:8,border:"1px solid var(--border)",background:"var(--surface)",color:"var(--text)",fontSize:14,boxSizing:"border-box" };
const cancelBtn: React.CSSProperties = { padding:"10px 20px",borderRadius:8,border:"1px solid var(--border)",background:"none",color:"var(--text)",cursor:"pointer",fontWeight:600 };
