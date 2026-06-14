"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Topbar from "@/components/layout/Topbar";
import { ClipboardCheck, X, CheckCircle } from "lucide-react";

type ReviewStatus = "UPCOMING"|"DUE"|"OVERDUE"|"COMPLETED"|"IN_PROGRESS";
type Outcome = "PASSED"|"MINOR_ISSUES"|"MAJOR_ISSUES";

interface Review {
  id:string; status:ReviewStatus; dueAt:string; completedAt?:string;
  outcome?:Outcome; notes?:string;
  asset?:{ id:string; name:string; type:string; criticality:string; };
}

const STATUS_CLASS: Record<ReviewStatus,string> = {
  UPCOMING:"badge-info", DUE:"badge-warning", OVERDUE:"badge-danger",
  COMPLETED:"badge-success", IN_PROGRESS:"badge-info",
};
const EMPTY_COMPLETE = { outcome:"PASSED" as Outcome, notes:"" };

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState<Review|null>(null);
  const [form,    setForm]    = useState(EMPTY_COMPLETE);
  const [saving,  setSaving]  = useState(false);
  const [filter,  setFilter]  = useState<ReviewStatus|"ALL">("ALL");

  const load = () => {
    setLoading(true);
    fetch("/api/reviews").then(r=>r.json()).then(setReviews).catch(()=>toast.error("Failed to load")).finally(()=>setLoading(false));
  };
  useEffect(()=>{ load(); },[]);

  const completeReview = async () => {
    if (!modal) return;
    setSaving(true);
    const res = await fetch(`/api/reviews/${modal.id}/complete`,{
      method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(form),
    });
    if (res.ok) { toast.success("Review completed"); setModal(null); load(); }
    else { const d=await res.json(); toast.error(d.error??"Failed"); }
    setSaving(false);
  };

  const filtered = filter==="ALL" ? reviews : reviews.filter(r=>r.status===filter);
  const counts = reviews.reduce((acc,r)=>{ acc[r.status]=(acc[r.status]??0)+1; return acc; },{} as Record<string,number>);

  return (
    <>
      <Topbar title="Reviews" subtitle="Track compliance reviews across all assets"/>
      <div className="app-content">
        {/* Status filter */}
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:20}}>
          {(["ALL","DUE","OVERDUE","UPCOMING","IN_PROGRESS","COMPLETED"] as const).map(s=>(
            <button key={s} onClick={()=>setFilter(s as any)} style={{padding:"5px 12px",borderRadius:20,border:"none",cursor:"pointer",fontSize:12,fontWeight:600,background:filter===s?"var(--brand)":"var(--surface)",color:filter===s?"#fff":"var(--text-muted)"}}>
              {s==="ALL"?`All (${reviews.length})`:s.replace(/_/g," ")}{s!=="ALL"&&counts[s]?` (${counts[s]})`:null}
            </button>
          ))}
        </div>

        <div className="card" style={{padding:0,overflow:"hidden"}}>
          {loading ? (
            <div style={{padding:40,textAlign:"center",color:"var(--text-muted)"}}>Loading reviews…</div>
          ) : !filtered.length ? (
            <div style={{padding:"60px 32px",textAlign:"center"}}>
              <ClipboardCheck size={40} style={{color:"var(--text-muted)",marginBottom:12}}/>
              <div style={{fontWeight:700,fontSize:16,marginBottom:6}}>No reviews found</div>
              <div style={{color:"var(--text-muted)",fontSize:14}}>Reviews are auto-scheduled when you register assets</div>
            </div>
          ) : (
            <table className="data-table">
              <thead><tr><th>Asset</th><th>Criticality</th><th>Due Date</th><th>Status</th><th>Outcome</th><th style={{textAlign:"right"}}>Action</th></tr></thead>
              <tbody>
                {filtered.map(r=>(
                  <tr key={r.id}>
                    <td>
                      <div style={{fontWeight:600,fontSize:14}}>{r.asset?.name??"-"}</div>
                      <div style={{fontSize:11,color:"var(--text-muted)"}}>{r.asset?.type?.replace(/_/g," ")}</div>
                    </td>
                    <td>
                      {r.asset?.criticality && (
                        <span className={`badge-${r.asset.criticality==="CRITICAL"?"danger":r.asset.criticality==="HIGH"?"warning":r.asset.criticality==="MEDIUM"?"info":"success"}`}>
                          {r.asset.criticality}
                        </span>
                      )}
                    </td>
                    <td style={{fontSize:13,color:r.status==="OVERDUE"?"#ef4444":"var(--text)"}}>
                      {new Date(r.dueAt).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}
                    </td>
                    <td><span className={STATUS_CLASS[r.status]}>{r.status.replace(/_/g," ")}</span></td>
                    <td style={{fontSize:13,color:"var(--text-muted)"}}>
                      {r.outcome
                        ? <span style={{color:r.outcome==="PASSED"?"#22c55e":r.outcome==="MAJOR_ISSUES"?"#ef4444":"#f59e0b",fontWeight:600}}>
                            {r.outcome.replace(/_/g," ")}
                          </span>
                        : "—"}
                    </td>
                    <td>
                      <div style={{display:"flex",justifyContent:"flex-end"}}>
                        {r.status!=="COMPLETED" && (
                          <button onClick={()=>{ setForm(EMPTY_COMPLETE); setModal(r); }} style={{background:"none",border:"1px solid var(--border)",borderRadius:6,padding:"5px 12px",cursor:"pointer",color:"var(--brand)",display:"flex",alignItems:"center",gap:4,fontSize:12,fontWeight:600}}>
                            <CheckCircle size={12}/> Complete
                          </button>
                        )}
                        {r.status==="COMPLETED" && r.completedAt && (
                          <span style={{fontSize:12,color:"var(--text-muted)"}}>
                            {new Date(r.completedAt).toLocaleDateString("en-GB",{day:"numeric",month:"short"})}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Complete Review Modal */}
      {modal && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",backdropFilter:"blur(6px)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div className="card" style={{width:"100%",maxWidth:480,padding:28}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <h3 style={{margin:0,fontWeight:700,fontSize:17}}>Complete Review</h3>
              <button onClick={()=>setModal(null)} style={{background:"none",border:"none",cursor:"pointer",color:"var(--text-muted)",display:"flex",padding:4}}><X size={18}/></button>
            </div>
            <div style={{marginBottom:16,padding:"12px 14px",background:"var(--surface)",borderRadius:8,fontSize:14}}>
              <div style={{fontWeight:600}}>{modal.asset?.name}</div>
              <div style={{color:"var(--text-muted)",fontSize:12,marginTop:2}}>Due: {new Date(modal.dueAt).toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"})}</div>
            </div>
            <div style={{display:"grid",gap:16}}>
              <div>
                <label style={{display:"block",fontSize:13,fontWeight:600,marginBottom:8}}>Review Outcome *</label>
                <div style={{display:"grid",gap:8}}>
                  {([["PASSED","✓ Passed — no issues found","#22c55e"],["MINOR_ISSUES","⚠ Minor issues — documented and tracked","#f59e0b"],["MAJOR_ISSUES","✗ Major issues — finding will be raised","#ef4444"]] as const).map(([val,label,color])=>(
                    <label key={val} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderRadius:8,border:`2px solid ${form.outcome===val?color:"var(--border)"}`,cursor:"pointer",background:form.outcome===val?`${color}15`:"none",transition:"all .15s"}}>
                      <input type="radio" name="outcome" value={val} checked={form.outcome===val} onChange={()=>setForm(f=>({...f,outcome:val}))} style={{accentColor:color}}/>
                      <span style={{fontSize:14,color:form.outcome===val?color:"var(--text)"}}>{label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label style={{display:"block",fontSize:13,fontWeight:600,marginBottom:6}}>Review Notes</label>
                <textarea value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} rows={4} placeholder="Summary of what was reviewed, actions taken, observations…" style={{width:"100%",padding:"10px 12px",borderRadius:8,border:"1px solid var(--border)",background:"var(--surface)",color:"var(--text)",fontSize:14,resize:"vertical",boxSizing:"border-box"}}/>
              </div>
              <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
                <button onClick={()=>setModal(null)} style={{padding:"10px 20px",borderRadius:8,border:"1px solid var(--border)",background:"none",color:"var(--text)",cursor:"pointer",fontWeight:600}}>Cancel</button>
                <button onClick={completeReview} disabled={saving} className="btn-primary" style={{padding:"10px 24px"}}>
                  {saving?"Submitting…":"Submit Review"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
