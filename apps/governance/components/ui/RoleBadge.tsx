import { ROLE_COLORS, ROLE_LABELS, type Role } from "@/lib/permissions";

interface Props {
  role: string;
  size?: "sm" | "md";
}

export default function RoleBadge({ role, size = "sm" }: Props) {
  const r = role as Role;
  const colors = ROLE_COLORS[r] ?? { bg: "rgba(156,163,175,0.1)", text: "#9ca3af", border: "rgba(156,163,175,0.2)" };
  const label  = ROLE_LABELS[r]  ?? role;

  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: size === "sm" ? "2px 8px" : "4px 12px",
      borderRadius: 100,
      fontSize: size === "sm" ? 11 : 12,
      fontWeight: 700,
      letterSpacing: "0.04em",
      background: colors.bg,
      color: colors.text,
      border: `1px solid ${colors.border}`,
      whiteSpace: "nowrap",
    }}>
      {label}
    </span>
  );
}
