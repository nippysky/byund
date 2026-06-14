"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Topbar from "@/components/layout/Topbar";
import { Download, Server, Database, Globe, Key, Cloud, HardDrive, Network, Cpu, Shield, Pencil, Archive, X } from "lucide-react";

type AssetType = "SERVER"|"DATABASE"|"SSL_CERT"|"DOMAIN"|"API_KEY"|"CLOUD"|"STORAGE"|"NETWORK"|"SERVICE";
type Criticality = "LOW"|"MEDIUM"|"HIGH"|"CRITICAL";

interface Asset {
  id:string; name:string; type:AssetType; criticality:Criticality;
  environment?:string; description?:string; reviewCycleDays:number;
  lastReviewedAt?:string; nextReviewDue?:string; createdAt:string;
}

const TYPE_ICON: Record<string, any> = {
  SERVER:Server, DATABASE:Database, SSL_CERT:Shield, DOMAIN:Globe,
  API_KEY:Key, CLOUD:Cloud, STORAGE:HardDrive, NETWORK:Network, SERVICE:Cpu,
};
const CRIT_CLASS: Record<Criticality,string> = {
  CRITICAL:"badge-danger", HIGH:"badge-warning", MEDIUM:"badge-info", LOW:"badge-success",
};
const EMPTY = { name:"", type:"SERVER" as AssetType, criticality:"MEDIUM" as Criticality, environment:"", description:"", reviewCycleDays:90 };

export default function AssetsPage() {
  const [assets,  setAssets]  = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState<"create"|"edit"|null>(null);
  const [editing, setEditing] = useState<Asset|null>(null);
  const [form,    setForm]    = useState(EMPTY);
  const [saving,  setSaving]  = useState(false);
  const [filter,  setFilter]  = useState<string>("ALL");

  const load = () => {
    setLoading(true);
    fetch("/api/assets").then(r=>r.json()).then(setAssets).catch(()=>toast.error("Failed to load")).finally(()=>setLoading(false));
  };
  useEffect(()=>{ load(); },[]);

  const openCreate = () => { setForm(EMPTY); setEditing(null); setModal("create"); };
  const openEdit = (a:Asset) => {
    setForm({ name:a.name, type:a.type, criticality:a.criticality, environment:a.environment??"", description:a.description??"", reviewCycleDays:a.reviewCycleDays });
    setEditing(a); setModal("edit");
  };

  const save = async () => {
    if (!form.name.trim()) { toast.error("Asset name is required"); return; }
    setSaving(true);
    const url    = modal==="edit" ? `/api/assets/${editing!.id}` : "/api/assets";
    const method = modal==="edit" ? "PUT" : "POST";
    const res    = await fetch(url,{ method,headers:{"Content-Type":"application/json"},body:JSON.stringify(form) });
    if (res.ok) { toast.success(modal==="edit"?"Asset updated":"Asset created"); setModal(null); load(); }
    else { const d=await res.json(); toast.error(d.error??"Failed"); }
    setSaving(false);
  };

  const archive = async (a:Asset) => {
    if (!confirm(`Archive "${a.name}"?`)) return;
    const res = await fetch(`/api/assets/${a.id}`,{method:"DELETE"});
    if (res.ok) { toast.success("Archived"); load(); }
    else toast.error("Failed to archive");
  };

  const filtered = filter==="ALL" ? assets : assets.filter(a=>a.type===filter);

  return (
    <>
      <Topbar title="Assets" subtitle={`${assets.length} registered assets`} action={{ label:"Register Asset", onClick:openCreate }}/>
      <div className="app-content">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:10}}>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {["ALL","SERVER","DATABASE","SSL_CERT","DOMAIN","API_KEY","CLOUD","STORAGE","NETWORK","SERVICE"].map(t=>(
              <button key={t} onClick={()=>setFilter(t)} style={{padding:"5px 12px",borderRadius:20,border:"none",cursor:"pointer",fontSize:12,fontWeight:600,background:filter===t?"var(--brand)":"var(--surface)",color:filter===t?"#fff":"var(--text-muted)"}}>
                {t==="ALL"?`All (${assets.length})`:t.replace(/_/g," ")}
              </button>
            ))}
          </div>
          <a href="/api/export/assets" target="_blank" style={{display:"flex",alignItems:"center",gap:6,padding:"7px 14px",borderRadius:8,border:"1px solid var(--border)",background:"none",color:"var(--text-muted)",fontSize:13,fontWeight:600,textDecoration:"none"}}>
            <Download size={14}/> Export Excel
          </a>
        </div>

        <div className="card" style={{padding:0,overflow:"hidden"}}>
          {loading ? (
            <div style={{padding:40,textAlign:"center",color:"var(--text-muted)"}}>Loading assets…</div>
          ) : !filtered.length ? (
            <div style={{padding:"60px 32px",textAlign:"center"}}>
              <Server size={40} style={{color:"var(--text-muted)",marginBottom:12}}/>
              <div style={{fontWeight:700,fontSize:16,marginBottom:6}}>No assets registered</div>
              <div style={{color:"var(--text-muted)",fontSize:14,marginBottom:20}}>Register your first IT asset to start tracking reviews</div>
              <button className="btn-primary" onClick={openCreate} style={{padding:"10px 24px"}}>Register Asset</button>
            </div>
          ) : (
            <table className="data-table">
              <thead><tr><th>Asset</th><th>Type</th><th>Criticality</th><th>Environment</th><th>Next Review</th><th>Cycle</th><th style={{textAlign:"right"}}>Actions</th></tr></thead>
              <tbody>
                {filtered.map(a=>{
                  const Icon = TYPE_ICON[a.type] ?? Server;
                  const overdue = a.nextReviewDue && new Date(a.nextReviewDue)<new Date();
                  return (
                    <tr key={a.id}>
                      <td>
                        <div style={{display:"flex",alignItems:"center",gap:10}}>
                          <Icon size={16} style={{color:"var(--brand)",flexShrink:0}}/>
                          <div>
                            <div style={{fontWeight:600,fontSize:14}}>{a.name}</div>
                            {a.description && <div style={{fontSize:11,color:"var(--text-muted)"}}>{a.description.slice(0,50)}{a.description.length>50?"…":""}</div>}
                          </div>
                        </div>
                      </td>
                      <td style={{fontSize:13,color:"var(--text-muted)"}}>{a.type.replace(/_/g," ")}</td>
                      <td><span className={CRIT_CLASS[a.criticality]}>{a.criticality}</span></td>
                      <td style={{fontSize:13,color:"var(--text-muted)"}}>{a.environment||"—"}</td>
                      <td style={{fontSize:13}}>
                        {a.nextReviewDue
                          ? <span style={{color:overdue?"#ef4444":"var(--text)",fontWeight:overdue?700:400}}>
                              {overdue&&"⚠ "}{new Date(a.nextReviewDue).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}
                            </span>
                          : <span style={{color:"var(--text-muted)"}}>Not scheduled</span>
                        }
                      </td>
                      <td style={{fontSize:13,color:"var(--text-muted)"}}>{a.reviewCycleDays}d</td>
                      <td>
                        <div style={{display:"flex",gap:6,justifyContent:"flex-end"}}>
                          <button onClick={()=>openEdit(a)} style={{background:"none",border:"1px solid var(--border)",borderRadius:6,padding:"5px 10px",cursor:"pointer",color:"var(--text-muted)",display:"flex",alignItems:"center",gap:4,fontSize:12}}>
                            <Pencil size={12}/> Edit
                          </button>
                          <button onClick={()=>archive(a)} title="Archive" style={{background:"none",border:"1px solid #ef444440",borderRadius:6,padding:"5px 8px",cursor:"pointer",color:"#ef4444",display:"flex"}}>
                            <Archive size={14}/>
                          </button>
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

      {modal && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",backdropFilter:"blur(6px)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div className="card" style={{width:"100%",maxWidth:520,padding:28,maxHeight:"90vh",overflowY:"auto"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <h3 style={{margin:0,fontWeight:700,fontSize:17}}>{modal==="create"?"Register Asset":"Edit Asset"}</h3>
              <button onClick={()=>setModal(null)} style={{background:"none",border:"none",cursor:"pointer",color:"var(--text-muted)",display:"flex",padding:4}}><X size={18}/></button>
            </div>
            <div style={{display:"grid",gap:16}}>
              <div>
                <label style={{display:"block",fontSize:13,fontWeight:600,marginBottom:6}}>Asset Name *</label>
                <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="e.g. Production PostgreSQL" style={inp}/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <div>
                  <label style={{display:"block",fontSize:13,fontWeight:600,marginBottom:6}}>Type</label>
                  <select value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value as AssetType}))} style={inp}>
                    {["SERVER","DATABASE","SSL_CERT","DOMAIN","API_KEY","CLOUD","STORAGE","NETWORK","SERVICE"].map(t=><option key={t} value={t}>{t.replace(/_/g," ")}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{display:"block",fontSize:13,fontWeight:600,marginBottom:6}}>Criticality</label>
                  <select value={form.criticality} onChange={e=>setForm(f=>({...f,criticality:e.target.value as Criticality}))} style={inp}>
                    {["LOW","MEDIUM","HIGH","CRITICAL"].map(c=><option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <div>
                  <label style={{display:"block",fontSize:13,fontWeight:600,marginBottom:6}}>Environment</label>
                  <input value={form.environment} onChange={e=>setForm(f=>({...f,environment:e.target.value}))} placeholder="production / staging" style={inp}/>
                </div>
                <div>
                  <label style={{display:"block",fontSize:13,fontWeight:600,marginBottom:6}}>Review Cycle (days)</label>
                  <input type="number" value={form.reviewCycleDays} onChange={e=>setForm(f=>({...f,reviewCycleDays:Number(e.target.value)}))} min={7} max={365} style={inp}/>
                </div>
              </div>
              <div>
                <label style={{display:"block",fontSize:13,fontWeight:600,marginBottom:6}}>Description (optional)</label>
                <textarea value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} rows={3} placeholder="Describe this asset…" style={{...inp,resize:"vertical"}}/>
              </div>
              <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
                <button onClick={()=>setModal(null)} style={{padding:"10px 20px",borderRadius:8,border:"1px solid var(--border)",background:"none",color:"var(--text)",cursor:"pointer",fontWeight:600}}>Cancel</button>
                <button onClick={save} disabled={saving} className="btn-primary" style={{padding:"10px 24px"}}>
                  {saving?"Saving…":modal==="create"?"Register Asset":"Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const inp: React.CSSProperties = {
  width:"100%",padding:"10px 12px",borderRadius:8,border:"1px solid var(--border)",
  background:"var(--surface)",color:"var(--text)",fontSize:14,boxSizing:"border-box",
};
