/**
 * BYUND Governance — RBAC Permission System
 *
 * Role hierarchy (highest → lowest):
 *   OWNER > ADMIN > ANALYST > VIEWER
 *
 * Principle: permissions are additive upward.
 * OWNER inherits all ADMIN, ANALYST, VIEWER permissions.
 */

export type Role = "OWNER" | "ADMIN" | "ANALYST" | "VIEWER";

export type Action =
  // Assets
  | "asset:create"
  | "asset:edit"
  | "asset:archive"
  | "asset:view"
  // Reviews
  | "review:create"
  | "review:complete"
  | "review:assign"
  | "review:view"
  // Findings
  | "finding:create"
  | "finding:edit"
  | "finding:resolve"
  | "finding:view"
  // Evidence
  | "evidence:upload"
  | "evidence:delete"
  | "evidence:view"
  | "evidence:download"
  // Team
  | "team:invite"
  | "team:remove"
  | "team:change_role"
  | "team:view"
  // Settings
  | "settings:edit"
  | "settings:view"
  | "settings:branding"
  // Audit Log
  | "audit:view"
  // Reports & Export
  | "report:view"
  | "report:export"
  // Workspace
  | "workspace:delete"
  | "workspace:transfer";

const PERMISSION_MATRIX: Record<Action, Role[]> = {
  // Assets — Analyst+ can create/edit, Viewer can only view
  "asset:view":    ["OWNER", "ADMIN", "ANALYST", "VIEWER"],
  "asset:create":  ["OWNER", "ADMIN", "ANALYST"],
  "asset:edit":    ["OWNER", "ADMIN", "ANALYST"],
  "asset:archive": ["OWNER", "ADMIN"],

  // Reviews
  "review:view":     ["OWNER", "ADMIN", "ANALYST", "VIEWER"],
  "review:create":   ["OWNER", "ADMIN", "ANALYST"],
  "review:complete": ["OWNER", "ADMIN", "ANALYST"],
  "review:assign":   ["OWNER", "ADMIN"],

  // Findings
  "finding:view":    ["OWNER", "ADMIN", "ANALYST", "VIEWER"],
  "finding:create":  ["OWNER", "ADMIN", "ANALYST"],
  "finding:edit":    ["OWNER", "ADMIN", "ANALYST"],
  "finding:resolve": ["OWNER", "ADMIN", "ANALYST"],

  // Evidence
  "evidence:view":     ["OWNER", "ADMIN", "ANALYST", "VIEWER"],
  "evidence:download": ["OWNER", "ADMIN", "ANALYST", "VIEWER"],
  "evidence:upload":   ["OWNER", "ADMIN", "ANALYST"],
  "evidence:delete":   ["OWNER", "ADMIN"],

  // Team
  "team:view":        ["OWNER", "ADMIN", "ANALYST", "VIEWER"],
  "team:invite":      ["OWNER", "ADMIN"],
  "team:remove":      ["OWNER", "ADMIN"],
  "team:change_role": ["OWNER"],

  // Settings
  "settings:view":     ["OWNER", "ADMIN", "ANALYST", "VIEWER"],
  "settings:edit":     ["OWNER", "ADMIN"],
  "settings:branding": ["OWNER"],

  // Audit Log — Admin+ can see full log
  "audit:view": ["OWNER", "ADMIN"],

  // Reports
  "report:view":   ["OWNER", "ADMIN", "ANALYST"],
  "report:export": ["OWNER", "ADMIN"],

  // Workspace-level destructive actions
  "workspace:delete":   ["OWNER"],
  "workspace:transfer": ["OWNER"],
};

/** Check if a role is allowed to perform an action */
export function can(role: Role | undefined | null, action: Action): boolean {
  if (!role) return false;
  return PERMISSION_MATRIX[action]?.includes(role) ?? false;
}

/** Check if role is at least as privileged as the minimum required */
export function hasMinRole(role: Role | undefined | null, minRole: Role): boolean {
  const hierarchy: Role[] = ["VIEWER", "ANALYST", "ADMIN", "OWNER"];
  if (!role) return false;
  return hierarchy.indexOf(role) >= hierarchy.indexOf(minRole);
}

/** Get all actions a role can perform */
export function getAllowedActions(role: Role): Action[] {
  return (Object.entries(PERMISSION_MATRIX) as [Action, Role[]][])
    .filter(([, roles]) => roles.includes(role))
    .map(([action]) => action);
}

export const ROLE_LABELS: Record<Role, string> = {
  OWNER:   "Owner",
  ADMIN:   "Admin",
  ANALYST: "Analyst",
  VIEWER:  "Viewer",
};

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  OWNER:   "Full control — billing, members, workspace settings, all data",
  ADMIN:   "Manage assets, reviews, findings, team members (except owner)",
  ANALYST: "Create and manage assets, findings, reviews, upload evidence",
  VIEWER:  "Read-only access to all workspace data",
};

export const ROLE_COLORS: Record<Role, { bg: string; text: string; border: string }> = {
  OWNER:   { bg: "rgba(114,96,251,0.12)", text: "#a496fd", border: "rgba(114,96,251,0.3)" },
  ADMIN:   { bg: "rgba(59,130,246,0.1)",  text: "#60a5fa", border: "rgba(59,130,246,0.25)" },
  ANALYST: { bg: "rgba(16,185,129,0.1)",  text: "#34d399", border: "rgba(16,185,129,0.25)" },
  VIEWER:  { bg: "rgba(156,163,175,0.1)", text: "#9ca3af", border: "rgba(156,163,175,0.2)" },
};
