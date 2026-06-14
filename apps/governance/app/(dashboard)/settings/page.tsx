"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Topbar from "@/components/layout/Topbar";
import { Save, Building2, Bell, Shield, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

interface Settings {
  defaultReviewCycleDays:number;
  autoRaiseFindingsOnMajorIssues:boolean;
  requireEvidenceForReview:boolean;
  notifyOnUpcomingReview:boolean;
  notifyDaysBeforeReview:number;
}

export default function SettingsPage() {
  const { workspace } = useAuth();
  const [settings, setSettings]   = useState<Settings>({
    defaultReviewCycleDays:90, autoRaiseFindingsOnMajorIssues:true,
    requireEvidenceForReview:false, notifyOnUpcomingReview:true, notifyDaysBeforeReview:7,
  });
  const [loading, setLoading]     = useState(true);
  const [saving,  setSaving]      = useState(false);
  const [changed, setChanged]     = useState(false);

  useEffect(()=>{
    fetch("/api/settings").then(r=>r.json()).then(d=>{ if (!d.error) setSettings(d); }).catch(()=>{}).finally(()=>setLoading(false));
  },[]);

  const update = (key: keyof Settings, val: any) => {
    setSettings(s=>({...s,[key]:val}));
    setChanged(true);
  };

  const save = async () => {
    setSaving(true);
    const res = await fetch("/api/settings",{ method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify(settings) });
    if (res.ok) { toast.success("Settings saved"); setChanged(false); }
    else { const d=await res.json(); toast.error(d.error??"Failed to save"); }
    setSaving(false);
  };

  if (loading) return (
    <>
      <Topbar title="Settings"/>
      <div className="app-content" style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:300}}>
        <div style={{color:"var(--text-muted)"}}>Loading settings…</div>
      </div>
    </>
  );

  return (
    <>
      <Topbar title="Settings" subtitle="Configure your workspace preferences"/>
      <div className="app-content" style={{maxWidth:700}}>

        {/* Workspace Info */}
        <div className="card" style={{padding:24,marginBottom:20}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
            <Building2 size={18} style={{color:"var(--brand)"}}/>
            <h3 style={{margin:0,fontWeight:700,fontSize:15}}>Workspace</h3>
          </div>
          <div style={{display:"grid",gap:14}}>
            <div>
              <label style={lbl}>Workspace Name</label>
              <input value={workspace?.name??"—"} disabled style={{...inp,opacity:.6,cursor:"not-allowed"}}/>
              <div style={{fontSize:12,color:"var(--text-muted)",marginTop:4}}>Contact support to rename your workspace</div>
            </div>
            <div>
              <label style={lbl}>Workspace Slug</label>
              <input value={workspace?.slug??"—"} disabled style={{...inp,opacity:.6,cursor:"not-allowed",fontFamily:"monospace"}}/>
            </div>
          </div>
        </div>

        {/* Review Defaults */}
        <div className="card" style={{padding:24,marginBottom:20}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
            <Shield size={18} style={{color:"var(--brand)"}}/>
            <h3 style={{margin:0,fontWeight:700,fontSize:15}}>Review Defaults</h3>
          </div>
          <div style={{display:"grid",gap:20}}>
            <div>
              <label style={lbl}>Default Review Cycle (days)</label>
              <input type="number" value={settings.defaultReviewCycleDays} min={7} max={365}
                onChange={e=>update("defaultReviewCycleDays",Number(e.target.value))} style={{...inp,maxWidth:160}}/>
              <div style={{fontSize:12,color:"var(--text-muted)",marginTop:4}}>Applied when registering new assets without a custom cycle</div>
            </div>
            <Toggle
              label="Auto-raise finding on major issues"
              desc="Automatically create a CRITICAL finding when a review outcome is MAJOR ISSUES"
              checked={settings.autoRaiseFindingsOnMajorIssues}
              onChange={v=>update("autoRaiseFindingsOnMajorIssues",v)}
            />
            <Toggle
              label="Require evidence for review completion"
              desc="Members must attach at least one evidence file before completing a review"
              checked={settings.requireEvidenceForReview}
              onChange={v=>update("requireEvidenceForReview",v)}
            />
          </div>
        </div>

        {/* Notifications */}
        <div className="card" style={{padding:24,marginBottom:20}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
            <Bell size={18} style={{color:"var(--brand)"}}/>
            <h3 style={{margin:0,fontWeight:700,fontSize:15}}>Notifications</h3>
          </div>
          <div style={{display:"grid",gap:20}}>
            <Toggle
              label="Notify before upcoming reviews"
              desc="Alert team members when a review is approaching its due date"
              checked={settings.notifyOnUpcomingReview}
              onChange={v=>update("notifyOnUpcomingReview",v)}
            />
            {settings.notifyOnUpcomingReview && (
              <div>
                <label style={lbl}>Notify how many days before due?</label>
                <input type="number" value={settings.notifyDaysBeforeReview} min={1} max={30}
                  onChange={e=>update("notifyDaysBeforeReview",Number(e.target.value))} style={{...inp,maxWidth:120}}/>
              </div>
            )}
          </div>
        </div>

        {/* Save */}
        <div style={{display:"flex",justifyContent:"flex-end",gap:12}}>
          {changed && <span style={{alignSelf:"center",fontSize:13,color:"var(--text-muted)"}}>Unsaved changes</span>}
          <button onClick={save} disabled={saving||!changed} className="btn-primary" style={{padding:"11px 28px",display:"flex",alignItems:"center",gap:8,opacity:!changed?.5:1}}>
            <Save size={15}/>{saving?"Saving…":"Save Settings"}
          </button>
        </div>
      </div>
    </>
  );
}

function Toggle({label,desc,checked,onChange}:{label:string;desc:string;checked:boolean;onChange:(v:boolean)=>void}) {
  return (
    <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:20}}>
      <div>
        <div style={{fontSize:14,fontWeight:600,marginBottom:3}}>{label}</div>
        <div style={{fontSize:12,color:"var(--text-muted)",lineHeight:1.5}}>{desc}</div>
      </div>
      <button
        onClick={()=>onChange(!checked)}
        style={{flexShrink:0,width:44,height:24,borderRadius:12,border:"none",cursor:"pointer",padding:0,position:"relative",background:checked?"var(--brand)":"var(--surface)",transition:"background .2s"}}
      >
        <div style={{position:"absolute",top:3,left:checked?22:3,width:18,height:18,borderRadius:"50%",background:"#fff",transition:"left .2s",boxShadow:"0 1px 3px rgba(0,0,0,.3)"}}/>
      </button>
    </div>
  );
}

const lbl: React.CSSProperties = { display:"block",fontSize:13,fontWeight:600,marginBottom:6,color:"var(--text)" };
const inp: React.CSSProperties = { width:"100%",padding:"10px 12px",borderRadius:8,border:"1px solid var(--border)",background:"var(--surface)",color:"var(--text)",fontSize:14,boxSizing:"border-box" };
