"use client";
import { useAuth } from "@/contexts/auth-context";
import { can, hasMinRole, type Action, type Role } from "@/lib/permissions";

export function usePermissions() {
  const { role } = useAuth();
  const r = role as Role | undefined;

  return {
    role: r,
    can:        (action: Action) => can(r, action),
    hasMinRole: (minRole: Role) => hasMinRole(r, minRole),
    isOwner:   r === "OWNER",
    isAdmin:   r === "ADMIN"   || r === "OWNER",
    isAnalyst: r === "ANALYST" || r === "ADMIN" || r === "OWNER",
    isViewer:  !!r,
  };
}
