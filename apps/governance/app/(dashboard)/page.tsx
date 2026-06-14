"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Topbar from "@/components/layout/Topbar";
import { Server, AlertTriangle, ClipboardCheck, ShieldCheck } from "lucide-react";

interface Stats {
  totalAssets: number; dueForReview: number; openFindings: number;
  criticalFindings: number; auditCoverage: number;
  upcomingReviews: any[]; recentActivity: any[];
}

const ACTION_COLORS: Record<string, string> = {
  ASSET_CREATED:"#22c55e",ASSET_UPDATED:"#7260fb",ASSET_ARCHIVED:"#94a3b8",
  REVIEW_COMPLETED:"#22c55e",FINDING_CREATED:"#ef4444",FINDING_RESOLVED:"#22c55e",
  MEMBER_INVITED:"#06b6d4",EVIDENCE_UPLOADED:"#8b5cf6",WORKSPACE_UPDATED:"#7260fb",
};

function Skel({ h=20 }:{h?:number}) {
  return <div style={{height:h,borderRadius:8,background:"var(--surface)",animation:"pulse 1.5s ease-in-out infinite"}}/>;
}

export default function DashboardPage() {
  const [stats,loading] = useFetch<Stats>("/api/dashboard/stats");

  const CARDS = stats ? [
    {label:"Total Assets",   value:stats.totalAssets,         icon:Server,        color:"var(--brand)"},
    {label:"Due for Review", value:stats.dueForReview,        icon:ClipboardCheck,color:"#f59e0b"},
    {label:"Open Findings",  value:stats.openFindings,        icon:AlertTriangle, color:"#ef4444"},
    {label:"Audit Coverage", value:`${stats.auditCoverage}%`, icon:ShieldCheck,   color:"#22c55e"},
  ] : [];

  return (
    <>
      <Topbar title="Dashboard" subtitle="Your governance overview at a glance"/>
      <div className="app-content">
        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>

        <div className="stats-grid" style={{marginBottom:24}}>
          {loading ? Array(4).fill(0).map((_,i)=><div key={i} className="stat-card"><Skel h={60}/></div>)
          : CARDS.map(({label,value,icon:Icon,color})=>(
            <div key={label} className="stat-card">
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
                <span style={{fontSize:13,color:"var(--text-muted)",fontWeight:500}}>{label}</span>
                <Icon size={18} style={{color}}/>
              </div>
              <div style={{fontSize:32,fontWeight:800}}>{value}</div>
            </div>
          ))}
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
          <div className="card" style={{padding:0,overflow:"hidden"}}>
            <div className="card-header" style={{padding:"16px 20px",borderBottom:"1px solid var(--border)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontWeight:700}}>Upcoming Reviews</span>
              <a href="/reviews" style={{fontSize:12,color:"var(--brand)",textDecoration:"none"}}>View all →</a>
            </div>
            {loading ? <div style={{padding:20}}><Skel h={120}/></div>
            : !stats?.upcomingReviews?.length
              ? <EmptyState msg="No upcoming reviews — add assets to get started"/>
              : <table className="data-table"><thead><tr><th>Asset</th><th>Due</th><th>Status</th></tr></thead><tbody>
                {stats.upcomingReviews.map((r:any)=>(
                  <tr key={r.id}>
                    <td><div style={{fontWeight:600,fontSize:14}}>{r.asset?.name}</div><div style={{fontSize:11,color:"var(--text-muted)"}}>{r.asset?.type}</div></td>
                    <td style={{fontSize:13}}>{new Date(r.dueAt).toLocaleDateString("en-GB",{day:"numeric",month:"short"})}</td>
                    <td><span className={`badge-${r.status==="OVERDUE"?"danger":r.status==="DUE"?"warning":"info"}`}>{r.status}</span></td>
                  </tr>
                ))}</tbody></table>
            }
          </div>

          <div className="card" style={{padding:20}}>
            <div style={{fontWeight:700,marginBottom:16}}>Recent Activity</div>
            {loading ? <Skel h={200}/>
            : !stats?.recentActivity?.length
              ? <EmptyState msg="No activity yet"/>
              : <div style={{display:"flex",flexDirection:"column",gap:12}}>
                {stats.recentActivity.map((log:any)=>(
                  <div key={log.id} style={{display:"flex",alignItems:"flex-start",gap:10}}>
                    <div style={{width:8,height:8,borderRadius:"50%",background:ACTION_COLORS[log.action]??"var(--brand)",marginTop:6,flexShrink:0}}/>
                    <div>
                      <span style={{fontSize:13,fontWeight:500}}>{log.actor?.name??"System"}</span>
                      <span style={{fontSize:13,color:"var(--text-muted)"}}> {log.action.replace(/_/g," ").toLowerCase()}</span>
                      {log.targetLabel&&<span style={{fontSize:13,color:"var(--brand)"}}> {log.targetLabel}</span>}
                      <div style={{fontSize:11,color:"var(--text-muted)",marginTop:2}}>{new Date(log.createdAt).toLocaleString("en-GB",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})}</div>
                    </div>
                  </div>
                ))}
              </div>
            }
          </div>
        </div>
      </div>
    </>
  );
}

function EmptyState({msg}:{msg:string}) {
  return <div style={{padding:"40px 20px",textAlign:"center",color:"var(--text-muted)",fontSize:14}}>{msg}</div>;
}

function useFetch<T>(url:string):[T|null,boolean] {
  const [data,setData]=useState<T|null>(null);
  const [loading,setLoading]=useState(true);
  useEffect(()=>{
    fetch(url).then(r=>r.json()).then(d=>{setData(d);setLoading(false);})
      .catch(()=>{toast.error("Failed to load data");setLoading(false);});
  },[url]);
  return [data,loading];
}
