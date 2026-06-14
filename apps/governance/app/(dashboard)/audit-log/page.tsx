"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Topbar from "@/components/layout/Topbar";
import { BookOpen, ChevronLeft, ChevronRight, Download } from "lucide-react";

interface LogEntry {
  id:string; action:string; targetLabel?:string; metadata?:any; createdAt:string;
  actor?:{ name:string; email:string; };
}

const ACTION_COLOR: Record<string,string> = {
  ASSET_CREATED:"#22c55e", ASSET_UPDATED:"#7260fb", ASSET_ARCHIVED:"#94a3b8",
  REVIEW_COMPLETED:"#22c55e", REVIEW_UPCOMING:"#06b6d4",
  FINDING_CREATED:"#ef4444", FINDING_RESOLVED:"#22c55e", FINDING_UPDATED:"#f59e0b",
  MEMBER_INVITED:"#06b6d4", MEMBER_REMOVED:"#ef4444", MEMBER_ROLE_CHANGED:"#f59e0b",
  EVIDENCE_UPLOADED:"#8b5cf6", WORKSPACE_UPDATED:"#7260fb",
};

export default function AuditLogPage() {
  const [logs,    setLogs]    = useState<LogEntry[]>([]);
  const [total,   setTotal]   = useState(0);
  const [loading, setLoading] = useState(true);
  const [page,    setPage]    = useState(1);
  const limit = 25;

  const load = (p=1) => {
    setLoading(true);
    fetch(`/api/audit-log?page=${p}&limit=${limit}`)
      .then(r=>r.json())
      .then(d=>{ setLogs(d.logs??[]); setTotal(d.total??0); })
      .catch(()=>toast.error("Failed to load audit log"))
      .finally(()=>setLoading(false));
  };
  useEffect(()=>{ load(page); },[page]);

  const totalPages = Math.max(1,Math.ceil(total/limit));

  const fmtAction = (action:string) => action.replace(/_/g," ").toLowerCase().replace(/^./,c=>c.toUpperCase());

  return (
    <>
      <Topbar title="Audit Log" subtitle={`${total} total entries`}/>
      <div className="app-content">
        <div style={{display:"flex",justifyContent:"flex-end",marginBottom:16}}>
          <a href="/api/export/findings" target="_blank" style={{display:"flex",alignItems:"center",gap:6,padding:"7px 14px",borderRadius:8,border:"1px solid var(--border)",background:"none",color:"var(--text-muted)",fontSize:13,fontWeight:600,textDecoration:"none"}}>
            <Download size={14}/> Export
          </a>
        </div>

        <div className="card" style={{padding:0,overflow:"hidden"}}>
          {loading ? (
            <div style={{padding:40,textAlign:"center",color:"var(--text-muted)"}}>Loading audit log…</div>
          ) : !logs.length ? (
            <div style={{padding:"60px 32px",textAlign:"center"}}>
              <BookOpen size={40} style={{color:"var(--text-muted)",marginBottom:12}}/>
              <div style={{fontWeight:700,fontSize:16,marginBottom:6}}>Audit log is empty</div>
              <div style={{color:"var(--text-muted)",fontSize:14}}>Every action in your workspace is recorded here automatically</div>
            </div>
          ) : (
            <table className="data-table">
              <thead><tr><th>Action</th><th>Actor</th><th>Target</th><th>Details</th><th>Timestamp</th></tr></thead>
              <tbody>
                {logs.map(log=>(
                  <tr key={log.id}>
                    <td>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <div style={{width:8,height:8,borderRadius:"50%",background:ACTION_COLOR[log.action]??"var(--brand)",flexShrink:0}}/>
                        <span style={{fontSize:13,fontWeight:600}}>{fmtAction(log.action)}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{fontSize:13,fontWeight:600}}>{log.actor?.name??"System"}</div>
                      <div style={{fontSize:11,color:"var(--text-muted)"}}>{log.actor?.email??""}</div>
                    </td>
                    <td style={{fontSize:13,color:"var(--text-muted)",maxWidth:200}}>{log.targetLabel??"-"}</td>
                    <td style={{fontSize:12,color:"var(--text-muted)",maxWidth:200}}>
                      {log.metadata
                        ? <span style={{fontFamily:"monospace",background:"var(--surface)",padding:"2px 6px",borderRadius:4,fontSize:11}}>
                            {typeof log.metadata==="object"?Object.entries(log.metadata).slice(0,2).map(([k,v])=>`${k}:${v}`).join(", "):String(log.metadata)}
                          </span>
                        : "—"
                      }
                    </td>
                    <td style={{fontSize:12,color:"var(--text-muted)",whiteSpace:"nowrap"}}>
                      {new Date(log.createdAt).toLocaleString("en-GB",{day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:16,marginTop:20}}>
            <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} style={{background:"none",border:"1px solid var(--border)",borderRadius:8,padding:"7px 12px",cursor:page===1?"not-allowed":"pointer",color:"var(--text-muted)",display:"flex",alignItems:"center",gap:4,fontSize:13,opacity:page===1?.4:1}}>
              <ChevronLeft size={14}/> Prev
            </button>
            <span style={{fontSize:13,color:"var(--text-muted)"}}>Page {page} of {totalPages} · {total} entries</span>
            <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages} style={{background:"none",border:"1px solid var(--border)",borderRadius:8,padding:"7px 12px",cursor:page===totalPages?"not-allowed":"pointer",color:"var(--text-muted)",display:"flex",alignItems:"center",gap:4,fontSize:13,opacity:page===totalPages?.4:1}}>
              Next <ChevronRight size={14}/>
            </button>
          </div>
        )}
      </div>
    </>
  );
}
