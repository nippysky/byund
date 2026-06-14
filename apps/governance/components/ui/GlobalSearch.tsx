"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, Server, AlertTriangle, ClipboardCheck, Users, X, Loader2 } from "lucide-react";

interface SearchResults {
  assets:   Array<{ id: string; name: string; type: string; criticality: string; _type: "asset" }>;
  findings: Array<{ id: string; title: string; severity: string; status: string; _type: "finding" }>;
  reviews:  Array<{ id: string; status: string; dueAt: string; asset: { name: string } | null; _type: "review" }>;
  members:  Array<{ id: string; name: string; email: string; _type: "member" }>;
}

const SEVERITY_COLORS: Record<string, string> = {
  CRITICAL: "#ef4444", HIGH: "#f97316", MEDIUM: "#f59e0b", LOW: "#6b7280",
};

export default function GlobalSearch() {
  const router  = useRouter();
  const [open,    setOpen]    = useState(false);
  const [query,   setQuery]   = useState("");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [cursor,  setCursor]  = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const timer    = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Cmd+K / Ctrl+K to open
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(o => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
    else { setQuery(""); setResults(null); }
  }, [open]);

  const search = useCallback(async (q: string) => {
    if (q.length < 2) { setResults(null); return; }
    setLoading(true);
    try {
      const res  = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.results);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => search(query), 300);
    return () => clearTimeout(timer.current);
  }, [query, search]);

  const allItems = results ? [
    ...results.assets.map(a => ({ label: a.name, sub: a.type.replace(/_/g," "), icon: Server,          href: "/assets",   color: "#7260fb" })),
    ...results.findings.map(f => ({ label: f.title, sub: f.severity,             icon: AlertTriangle,   href: "/findings", color: SEVERITY_COLORS[f.severity] ?? "#6b7280" })),
    ...results.reviews.map(r  => ({ label: r.asset?.name ?? "Review", sub: r.status, icon: ClipboardCheck, href: "/reviews",  color: "#3b82f6" })),
    ...results.members.map(m  => ({ label: m.name, sub: m.email,                 icon: Users,           href: "/team",     color: "#10b981" })),
  ] : [];

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setCursor(c => Math.min(c + 1, allItems.length - 1)); }
    if (e.key === "ArrowUp")   { e.preventDefault(); setCursor(c => Math.max(c - 1, 0)); }
    if (e.key === "Enter" && allItems[cursor]) { router.push(allItems[cursor].href); setOpen(false); }
  };

  if (!open) return null;

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: 80 }}
      onClick={() => setOpen(false)}
    >
      <div
        style={{ width: "100%", maxWidth: 600, background: "var(--surface-1)", border: "1px solid var(--border-med)", borderRadius: 16, overflow: "hidden", boxShadow: "0 24px 80px rgba(0,0,0,0.5)" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Input */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", borderBottom: "1px solid var(--border)" }}>
          {loading ? <Loader2 size={18} style={{ color: "var(--brand)", flexShrink: 0, animation: "spin 0.8s linear infinite" }} /> : <Search size={18} style={{ color: "var(--text-muted)", flexShrink: 0 }} />}
          <input
            ref={inputRef}
            value={query}
            onChange={e => { setQuery(e.target.value); setCursor(0); }}
            onKeyDown={handleKey}
            placeholder="Search assets, findings, reviews, team…"
            style={{ flex: 1, background: "none", border: "none", outline: "none", fontSize: 15, color: "var(--text-1)", fontFamily: "inherit" }}
          />
          <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex" }}>
            <X size={16} />
          </button>
        </div>

        {/* Results */}
        {allItems.length > 0 && (
          <div style={{ maxHeight: 380, overflowY: "auto" }}>
            {results && results.assets.length > 0 && (
              <Section label="Assets" items={results.assets.map((a, i) => ({
                label: a.name, sub: a.type.replace(/_/g," "), icon: Server, href: "/assets",
                color: "#7260fb", active: cursor === i,
              }))} offset={0} cursor={cursor} onSelect={() => { router.push("/assets"); setOpen(false); }} />
            )}
            {results && results.findings.length > 0 && (
              <Section label="Findings" items={results.findings.map((f, i) => ({
                label: f.title, sub: f.severity, icon: AlertTriangle, href: "/findings",
                color: SEVERITY_COLORS[f.severity] ?? "#6b7280",
                active: cursor === (results.assets.length + i),
              }))} offset={results.assets.length} cursor={cursor} onSelect={() => { router.push("/findings"); setOpen(false); }} />
            )}
            {results && results.reviews.length > 0 && (
              <Section label="Reviews" items={results.reviews.map((r, i) => ({
                label: r.asset?.name ?? "Review", sub: r.status, icon: ClipboardCheck, href: "/reviews",
                color: "#3b82f6",
                active: cursor === (results.assets.length + results.findings.length + i),
              }))} offset={results.assets.length + results.findings.length} cursor={cursor} onSelect={() => { router.push("/reviews"); setOpen(false); }} />
            )}
            {results && results.members.length > 0 && (
              <Section label="Team" items={results.members.map((m, i) => ({
                label: m.name, sub: m.email, icon: Users, href: "/team",
                color: "#10b981",
                active: cursor === (results.assets.length + results.findings.length + results.reviews.length + i),
              }))} offset={results.assets.length + results.findings.length + results.reviews.length} cursor={cursor} onSelect={() => { router.push("/team"); setOpen(false); }} />
            )}
          </div>
        )}

        {query.length >= 2 && !loading && allItems.length === 0 && (
          <div style={{ padding: "32px 20px", textAlign: "center", color: "var(--text-muted)", fontSize: 14 }}>
            No results for &ldquo;{query}&rdquo;
          </div>
        )}

        {!query && (
          <div style={{ padding: "20px 18px" }}>
            <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 12 }}>Quick navigate</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {[
                { label: "Assets",    href: "/assets",    icon: Server },
                { label: "Findings",  href: "/findings",  icon: AlertTriangle },
                { label: "Reviews",   href: "/reviews",   icon: ClipboardCheck },
                { label: "Team",      href: "/team",      icon: Users },
              ].map(({ label, href, icon: Icon }) => (
                <button key={href} onClick={() => { router.push(href); setOpen(false); }}
                  style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 12px", borderRadius: 8, background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text-2)", fontSize: 13, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>
                  <Icon size={13} />
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div style={{ padding: "8px 18px", borderTop: "1px solid var(--border)", display: "flex", gap: 16, fontSize: 11, color: "var(--text-muted)" }}>
          <span>↑↓ navigate</span>
          <span>↵ select</span>
          <span>esc close</span>
        </div>
      </div>
    </div>
  );
}

function Section({ label, items, cursor, offset, onSelect }: {
  label: string;
  items: Array<{ label: string; sub: string; icon: React.ElementType; href: string; color: string; active: boolean }>;
  cursor: number;
  offset: number;
  onSelect: (href: string) => void;
}) {
  return (
    <div>
      <div style={{ padding: "8px 18px 4px", fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{label}</div>
      {items.map((item, i) => {
        const Icon = item.icon;
        const isActive = cursor === offset + i;
        return (
          <button key={i} onClick={() => onSelect(item.href)}
            style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "10px 18px", background: isActive ? "var(--surface-2)" : "transparent", border: "none", cursor: "pointer", textAlign: "left", fontFamily: "inherit" }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: `${item.color}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon size={13} style={{ color: item.color }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.label}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{item.sub}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
