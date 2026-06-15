"use client";

import { useRef, useState } from "react";
import { Upload, Loader2 } from "lucide-react";

interface Props {
  initials:   string;
  name:       string;
  avatarUrl?: string;
}

export function AvatarUpload({ initials, name, avatarUrl: initialUrl }: Props) {
  const [url,     setUrl]     = useState<string | undefined>(initialUrl);
  const [preview, setPreview] = useState<string | undefined>(initialUrl);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) { setError("Please choose an image file."); return; }
    if (file.size > 5 * 1024 * 1024)    { setError("Image must be under 5 MB."); return; }

    // Show instant local preview while uploading
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      // 1. Get signed params from server
      const signRes = await fetch("/api/user/avatar/sign");
      if (!signRes.ok) throw new Error("Could not get upload credentials.");
      const { signature, timestamp, cloudName, apiKey, uploadPreset, folder } = await signRes.json();

      // 2. Upload directly to Cloudinary
      const form = new FormData();
      form.append("file",          file);
      form.append("upload_preset", uploadPreset);
      form.append("folder",        folder);
      form.append("timestamp",     String(timestamp));
      form.append("api_key",       apiKey);
      form.append("signature",     signature);

      const upRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body:   form,
      });
      if (!upRes.ok) throw new Error("Upload to Cloudinary failed.");
      const { secure_url } = await upRes.json();

      // 3. Save URL to DB
      const saveRes = await fetch("/api/user/avatar", {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ avatarUrl: secure_url }),
      });
      if (!saveRes.ok) throw new Error("Could not save avatar.");

      setUrl(secure_url);
      setPreview(secure_url);
      setSuccess(true);
      URL.revokeObjectURL(localUrl);
    } catch (e: unknown) {
      setPreview(url);  // revert to old URL on error
      setError((e as Error).message ?? "Upload failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
      {/* Avatar preview */}
      <div style={{ position: "relative", flexShrink: 0 }}>
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt={name}
            style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover" }}
          />
        ) : (
          <div style={{
            width: 72, height: 72, borderRadius: "50%",
            background: "linear-gradient(135deg, #7260fb, #4f3dd4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 24, fontWeight: 800, color: "#fff",
          }}>
            {initials}
          </div>
        )}
        {loading && (
          <div style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            background: "rgba(0,0,0,0.45)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Loader2 size={20} color="#fff" style={{ animation: "spin 0.9s linear infinite" }} />
          </div>
        )}
      </div>

      {/* Controls */}
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 3 }}>{name}</div>
        <div style={{ fontSize: 12, color: "var(--text-3)", marginBottom: 12 }}>
          JPG, PNG or WebP · max 5 MB
        </div>
        <button
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            fontSize: 12, fontWeight: 600, padding: "8px 14px", borderRadius: 8,
            background: "var(--surface-2)", border: "1px solid var(--border-med)",
            color: "var(--text-1)", cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
          }}
        >
          <Upload size={12} />
          {loading ? "Uploading…" : preview ? "Change photo" : "Upload photo"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }}
        />
        {error   && <p style={{ marginTop: 8, fontSize: 12, color: "var(--danger)" }}>{error}</p>}
        {success && <p style={{ marginTop: 8, fontSize: 12, color: "#22c55e" }}>Photo saved!</p>}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
