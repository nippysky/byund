"use client";
import { type ReactNode } from "react";
import { usePermissions } from "@/hooks/usePermissions";
import { type Action, type Role } from "@/lib/permissions";

interface Props {
  action?: Action;
  minRole?: Role;
  fallback?: ReactNode;
  children: ReactNode;
}

/**
 * Renders children only if the current user has the required permission.
 * Usage:
 *   <PermissionGuard action="asset:create">
 *     <button>Add Asset</button>
 *   </PermissionGuard>
 */
export default function PermissionGuard({ action, minRole, fallback = null, children }: Props) {
  const perms = usePermissions();

  if (action && !perms.can(action)) return <>{fallback}</>;
  if (minRole && !perms.hasMinRole(minRole)) return <>{fallback}</>;

  return <>{children}</>;
}
