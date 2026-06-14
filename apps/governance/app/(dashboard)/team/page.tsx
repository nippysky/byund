"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Topbar from "@/components/layout/Topbar";
import { Users, UserPlus, X, Mail, Trash2, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

type Role = "OWNER"|"ADMIN"|"ANALYST"|"VIEWER";

interface Member {
  id:string; role:Role; createdAt:string;
  user:{ id:string; name:string; email:string; };
}

const ROLE_DESC: Record<Role,string> = {
  OWNER:"Full access, cannot be removed",
  ADMIN:"Manage assets, reviews, team",
  ANALYST:"Create/complete reviews and findings",
  VIEWER:"Read-only access",
};

export default function TeamPage() {
  const { user: me } = useAuth();
  const [members, setMembers]   = useState<Member[]>([]);
  const [loading, setLoading]   = useState(true);
  const [modal,   setModal]     = useState(false);
  const [name,    setName]      = useState("");
  const [email,   setEmail]     = useState("");
  const [role,    setRole]      = useState<Role>("ANALYST");
  const [saving,  setSaving]    = useState(false);
  const [tempPw,  setTempPw]    = useState<string|null>(null);

  const load = () => {
    setLoading(true);
    fetch("/api/team").then(r=>r.json()).then(setMembers).catch(()=>toast.error("Failed to load")).finally(()=>setLoading(false));
  };
  useEffect(()=>{ load(); },[]);

  const invite = async () => {
    if (!name.trim()||!email.trim()) { toast.error("Name and email required"); return; }
    setSaving(true);
    const res = await fetch("/api/team",{ method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({name,email,role}) });
    const d   = await res.json();
    if (res.ok) { toast.success(`Invite sent to ${email}`); setTempPw(d.tempPassword??null); setName(""); setEmail(""); setRole("ANALYST"); load(); }
    else toast.error(d.error??"Failed");
    setSaving(false);
  };

  const changeRole = async (m:Member, newRole:Role) => {
    if (m.role==="OWNER") { toast.error("Cannot change owner role"); return; }
    const res = await fetch(`/api/team/${m.id}`,{ method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify({role:newRole}) });
    if (res.ok) { toast.success("Role updated"); load(); }
    else toast.error("Failed to update role");
  };

  const removeMember = async (m:Member) => {
    if (m.role==="OWNER") { toast.error("Cannot remove workspace owner"); return; }
    if (!confirm(`Remove ${m.user.name} from the workspace?`)) return;
    const res = await fetch(`/api/team/${m.id}`,{ method:"DELETE" });
    if (res.ok) { toast.success("Member removed"); load(); }
    else toast.error("Failed to remove member");
  };

  const ROLE_COLOR: Record<Role,string> = { OWNER:"#7260fb", ADMIN:"#22c55e", ANALYST:"#f59e0b", VIEWER:"#94a3b8" };

  return (
    <>
      <Topbar title="Team" subtitle={`${members.length} workspace member${members.length!==1?"s":""}`} action={{ label:"Invite Member", onClick:()=>setModal(true) }}/>
      <div className="app-content">
        <div className="card" style={{padding:0,overflow:"hidden"}}>
          {loading ? <div style={{padding:40,textAlign:"center",color:"var(--text-muted)"}}>Loading team…</div>
          : !members.length ? (
            <div style={{padding:"60px 32px",textAlign:"center"}}>
              <Users size={40} style={{color:"var(--text-muted)",marginBottom:12}}/>
              <div style={{fontWeight:700,fontSize:16,marginBottom:6}}>No team members yet</div>
              <div style={{color:"var(--text-muted)",fontSize:14,marginBottom:20}}>Invite your team to collaborate on governance</div>
              <button className="btn-primary" onClick={()=>setModal(true)} style={{padding:"10px 24px"}}>Invite Member</button>
            </div>
          ) : (
            <table className="data-table">
              <thead><tr><th>Member</th><th>Email</th><th>Role</th><th>Joined</th><th style={{textAlign:"right"}}>Actions</th></tr></thead>
              <tbody>
                {members.map(m=>(
                  <tr key={m.id}>
                    <td>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <div style={{width:34,height:34,borderRadius:"50%",background:`linear-gradient(135deg,${ROLE_COLOR[m.role]},#4f3dd4)`,color:"#fff",fontWeight:700,fontSize:12,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                          {m.user.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
                        </div>
                        <div>
                          <div style={{fontWeight:600,fontSize:14}}>{m.user.name}</div>
                          {m.user.id===me?.id&&<div style={{fontSize:11,color:"var(--brand)"}}>You</div>}
                        </div>
                      </div>
                    </td>
                    <td style={{fontSize:13,color:"var(--text-muted)"}}>{m.user.email}</td>
                    <td>
                      {m.role==="OWNER" ? (
                        <span style={{fontSize:12,fontWeight:700,color:ROLE_COLOR.OWNER,background:"rgba(114,96,251,.12)",padding:"4px 10px",borderRadius:20}}>OWNER</span>
                      ) : m.user.id===me?.id ? (
                        <span style={{fontSize:12,fontWeight:700,color:ROLE_COLOR[m.role]}}>{m.role}</span>
                      ) : (
                        <div style={{position:"relative",display:"inline-block"}}>
                          <select
                            value={m.role}
                            onChange={e=>changeRole(m,e.target.value as Role)}
                            style={{appearance:"none",background:"var(--surface)",border:"1px solid var(--border)",borderRadius:6,padding:"4px 28px 4px 10px",fontSize:12,fontWeight:700,color:ROLE_COLOR[m.role],cursor:"pointer"}}
                          >
                            {(["ADMIN","ANALYST","VIEWER"] as Role[]).map(r=><option key={r} value={r}>{r}</option>)}
                          </select>
                          <ChevronDown size={12} style={{position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",pointerEvents:"none",color:"var(--text-muted)"}}/>
                        </div>
                      )}
                    </td>
                    <td style={{fontSize:13,color:"var(--text-muted)"}}>{new Date(m.createdAt).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}</td>
                    <td>
                      <div style={{display:"flex",justifyContent:"flex-end"}}>
                        {m.role!=="OWNER" && m.user.id!==me?.id && (
                          <button onClick={()=>removeMember(m)} title="Remove member" style={{background:"none",border:"1px solid #ef444440",borderRadius:6,padding:"5px 8px",cursor:"pointer",color:"#ef4444",display:"flex"}}>
                            <Trash2 size={14}/>
                          </button>
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

      {/* Invite Modal */}
      {modal && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",backdropFilter:"blur(6px)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div className="card" style={{width:"100%",maxWidth:460,padding:28}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <h3 style={{margin:0,fontWeight:700,fontSize:17}}>Invite Team Member</h3>
              <button onClick={()=>{setModal(false);setTempPw(null);}} style={{background:"none",border:"none",cursor:"pointer",color:"var(--text-muted)",display:"flex",padding:4}}><X size={18}/></button>
            </div>

            {tempPw ? (
              <div>
                <div style={{background:"rgba(34,197,94,.1)",border:"1px solid rgba(34,197,94,.3)",borderRadius:10,padding:20,marginBottom:20}}>
                  <div style={{fontWeight:700,marginBottom:8,color:"#22c55e"}}>✓ Invitation created!</div>
                  <div style={{fontSize:14,color:"var(--text-muted)",marginBottom:12}}>Share these credentials with the new member. They should change their password after first login.</div>
                  <div style={{background:"var(--surface)",borderRadius:8,padding:"12px 14px"}}>
                    <div style={{fontSize:12,fontWeight:600,color:"var(--text-muted)",marginBottom:4}}>TEMPORARY PASSWORD</div>
                    <div style={{fontFamily:"monospace",fontSize:16,fontWeight:700,letterSpacing:2,color:"var(--brand)"}}>{tempPw}</div>
                  </div>
                </div>
                <button onClick={()=>{ setModal(false); setTempPw(null); }} className="btn-primary" style={{width:"100%",padding:12}}>Done</button>
              </div>
            ) : (
              <div style={{display:"grid",gap:16}}>
                <div>
                  <label style={lbl}>Full Name *</label>
                  <input value={name} onChange={e=>setName(e.target.value)} placeholder="Femi Adesanya" style={inp}/>
                </div>
                <div>
                  <label style={lbl}>Work Email *</label>
                  <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="femi@company.com" style={inp}/>
                </div>
                <div>
                  <label style={lbl}>Role</label>
                  <select value={role} onChange={e=>setRole(e.target.value as Role)} style={inp}>
                    {(["ADMIN","ANALYST","VIEWER"] as Role[]).map(r=>(
                      <option key={r} value={r}>{r} — {ROLE_DESC[r]}</option>
                    ))}
                  </select>
                </div>
                <div style={{fontSize:12,color:"var(--text-muted)",padding:"10px 14px",background:"var(--surface)",borderRadius:8,lineHeight:1.6}}>
                  A temporary password will be generated. Share it securely with the invitee.
                </div>
                <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
                  <button onClick={()=>setModal(false)} style={{padding:"10px 20px",borderRadius:8,border:"1px solid var(--border)",background:"none",color:"var(--text)",cursor:"pointer",fontWeight:600}}>Cancel</button>
                  <button onClick={invite} disabled={saving} className="btn-primary" style={{padding:"10px 24px"}}>
                    {saving?"Inviting…":"Send Invite"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

const lbl: React.CSSProperties = { display:"block",fontSize:13,fontWeight:600,marginBottom:6 };
const inp: React.CSSProperties = { width:"100%",padding:"10px 12px",borderRadius:8,border:"1px solid var(--border)",background:"var(--surface)",color:"var(--text)",fontSize:14,boxSizing:"border-box" };
