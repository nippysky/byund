// ─────────────────────────────────────────────────────────────────────────────
// BYUND Shared TypeScript Types
// Used across apps/governance, apps/api, apps/web
// ─────────────────────────────────────────────────────────────────────────────

// ── Auth ─────────────────────────────────────────────────────────────────────

export interface JwtUser {
  id: string;
  email: string;
  workspaceId?: string;
  role?: WorkspaceMemberRole;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface AuthResponse extends AuthTokens {
  user: PublicUser;
}

// ── Users ────────────────────────────────────────────────────────────────────

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export type WorkspaceMemberRole = "OWNER" | "ADMIN" | "REVIEWER" | "VIEWER";

export interface WorkspaceMember {
  id: string;
  userId: string;
  workspaceId: string;
  role: WorkspaceMemberRole;
  user: PublicUser;
  joinedAt: string | null;
}

// ── Workspaces ───────────────────────────────────────────────────────────────

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  industry?: string;
  timezone: string;
  createdAt: string;
}

// ── Assets ───────────────────────────────────────────────────────────────────

export type AssetType =
  | "SERVER" | "DATABASE" | "SSL_CERT" | "DOMAIN"
  | "API_KEY" | "CLOUD" | "STORAGE" | "NETWORK" | "SERVICE";

export type Criticality = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface Asset {
  id: string;
  workspaceId: string;
  name: string;
  type: AssetType;
  criticality: Criticality;
  description?: string;
  environment?: string;
  ownerId?: string;
  owner?: PublicUser;
  reviewCycleDays: number;
  lastReviewedAt?: string;
  nextReviewDue?: string;
  archivedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ── Reviews ──────────────────────────────────────────────────────────────────

export type ReviewStatus = "UPCOMING" | "DUE" | "OVERDUE" | "IN_PROGRESS" | "COMPLETED" | "SKIPPED";
export type ReviewOutcome = "PASSED" | "MINOR_ISSUES" | "MAJOR_ISSUES";

export interface Review {
  id: string;
  workspaceId: string;
  assetId: string;
  asset?: Asset;
  assigneeId?: string;
  assignee?: PublicUser;
  scheduledAt: string;
  dueAt: string;
  startedAt?: string;
  completedAt?: string;
  status: ReviewStatus;
  outcome?: ReviewOutcome;
  notes?: string;
  createdAt: string;
}

// ── Findings ─────────────────────────────────────────────────────────────────

export type FindingSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type FindingStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "WONT_FIX";

export interface Finding {
  id: string;
  workspaceId: string;
  assetId?: string;
  asset?: Asset;
  reviewId?: string;
  assigneeId?: string;
  assignee?: PublicUser;
  title: string;
  description?: string;
  severity: FindingSeverity;
  status: FindingStatus;
  resolution?: string;
  resolvedAt?: string;
  dueAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ── Evidence ─────────────────────────────────────────────────────────────────

export type EvidenceType = "SCREENSHOT" | "DOCUMENT" | "LOG" | "CONFIG" | "REPORT" | "OTHER";

export interface Evidence {
  id: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  type: EvidenceType;
  downloadUrl?: string;
  createdAt: string;
  uploader: PublicUser;
}

// ── Audit Log ────────────────────────────────────────────────────────────────

export type AuditAction =
  | "ASSET_CREATED" | "ASSET_UPDATED" | "ASSET_ARCHIVED"
  | "REVIEW_STARTED" | "REVIEW_COMPLETED" | "REVIEW_SKIPPED"
  | "FINDING_CREATED" | "FINDING_UPDATED" | "FINDING_RESOLVED"
  | "EVIDENCE_UPLOADED"
  | "MEMBER_INVITED" | "MEMBER_REMOVED" | "MEMBER_ROLE_CHANGED"
  | "WORKSPACE_UPDATED" | "SETTINGS_CHANGED";

export interface AuditLogEntry {
  id: string;
  workspaceId: string;
  actor?: PublicUser;
  action: AuditAction;
  targetType?: string;
  targetId?: string;
  targetLabel?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

// ── API Responses ─────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error: string;
}

// ── Dashboard Stats ───────────────────────────────────────────────────────────

export interface DashboardStats {
  totalAssets: number;
  dueForReview: number;
  openFindings: number;
  auditCoverage: number;   // percentage 0–100
  overdueReviews: number;
  criticalFindings: number;
}
