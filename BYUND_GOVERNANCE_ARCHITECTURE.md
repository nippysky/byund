# BYUND Governance — Architecture Blueprint
### NIPPYSKY LIMITED · Version 1.0 · June 2026
### Prepared for CTO Review — Do Not Begin Coding Until Signed Off

---

## 1. Product Overview

**BYUND Governance** is a multi-tenant, enterprise-grade SaaS platform that gives IT teams a single authoritative source for:

- What digital assets the organization owns
- Who owns each asset (technical + business)
- When each asset was last reviewed and when the next review is due
- What audit findings exist against each asset
- What evidence and documents support governance decisions
- Who did what and when (immutable audit trail)

It is explicitly **not** a ticketing system, SIEM, IAM, monitoring tool, or helpdesk. It is an **Asset Ownership & Governance Record System**.

---

## 2. Tech Stack — Latest Versions (June 2026)

### Frontend
| Package | Version | Reason |
|---|---|---|
| Next.js | 16.x | App Router, Server Components, Partial Prerendering |
| TypeScript | 5.5+ | Strict mode throughout |
| Tailwind CSS | 4.x | New oxide engine, zero-config CSS variables |
| TanStack Query | v5 | Async state, caching, background refetch |
| Zustand | v5 | Lightweight client state (auth, theme, UI prefs) |
| React Hook Form | v8 | Form management |
| Zod | v3.23+ | Schema validation, shared with backend |

### Backend
| Package | Version | Reason |
|---|---|---|
| NestJS | 11.x | Module architecture, DI, decorators |
| TypeScript | 5.5+ | Strict mode |
| Prisma ORM | 7.x | New client, typed query builder, migrations |
| PostgreSQL | 16 | JSONB, partitioning, row-level security |
| Redis | 7.x | Sessions, BullMQ queues, short-lived caches |
| BullMQ | 5.x | Review scheduling jobs, email notification queue |
| Nodemailer + Resend | latest | Transactional email |
| Passport.js | 0.7+ | JWT + local strategies |
| class-validator | latest | DTO validation |
| MinIO SDK | latest | S3-compatible object storage |

### Infrastructure
| Component | Choice | Reason |
|---|---|---|
| Containerisation | Docker + Compose | Solo-founder deployable, no k8s overhead in v1 |
| Reverse proxy | Nginx | TLS termination, rate limiting |
| Object storage | MinIO | Self-hosted S3-compatible, swap to AWS S3 later |
| CI/CD | GitHub Actions | Free tier, adequate for v1 |

---

## 3. Multi-Tenancy Architecture

### Strategy: **Shared Database, Tenant-Isolated Rows**

Every table carries `tenant_id`. This is the simplest, most maintainable approach for a solo founder. It allows you to:

- Ship v1 quickly without per-tenant schema migrations
- Add PostgreSQL Row-Level Security in v1.1 for stronger isolation
- Migrate to dedicated schemas per enterprise tenant in v2 without a rewrite

### Tenant Hierarchy

```
Tenant (nippysky-saas-root)
  └── Organization (e.g. "Acme Corp")
        ├── Teams (e.g. "Security", "DevOps")
        │     └── TeamMemberships → Users
        ├── Users
        ├── Assets
        ├── Reviews
        ├── Findings
        ├── Documents
        ├── Notifications
        └── ActivityLogs
```

A **Tenant** is the billing/SaaS-account unit. An **Organization** is the operational unit a user logs into. V1 supports one organization per tenant (1:1). V1.1 will support multiple organizations per tenant (enterprise groups).

### Tenant Resolution

Every API request resolves the tenant via:
1. **JWT claim** → `tenantId` + `organizationId` embedded at login
2. **Middleware** → `TenantContextMiddleware` injects `req.tenant` before any controller
3. **Guards** → `@TenantGuard()` validates the claim matches the resource

---

## 4. Authentication & Session Design

```
Client → POST /auth/login → { accessToken (15min JWT), refreshToken (7d, httpOnly cookie) }
Client → GET /api/... → Bearer accessToken in Authorization header
Client → POST /auth/refresh → Rotate refreshToken, issue new accessToken
Client → POST /auth/logout → Revoke refreshToken in DB
```

- Access tokens: **15-minute expiry**, stateless JWT
- Refresh tokens: **7-day expiry**, stored in `refresh_tokens` table, rotated on use (rotation = old token revoked, new one issued)
- Token revocation: checked against DB on every refresh (not on every request — that's what the 15-min access token prevents)
- Passwords: `bcrypt` with cost factor 12

---

## 5. RBAC Permission Model

### Six Roles (System-Defined, Immutable in v1)

| Role | Who | Capabilities |
|---|---|---|
| `super_admin` | NIPPYSKY ops | All tenants, all actions, billing |
| `governance_admin` | Org admin | All org data, manage users/roles, configure schedules |
| `manager` | Dept/team lead | Approve reviews, assign findings, manage team assets |
| `reviewer` | Engineer/analyst | Complete assigned reviews, upload evidence |
| `auditor` | Internal/external auditor | Read-only across all assets, findings, evidence |
| `viewer` | Stakeholder | Read-only dashboard and reports |

### Permission Naming Convention

```
{resource}:{action}
```

Examples:
- `asset:create` `asset:read` `asset:update` `asset:delete`
- `review:read` `review:complete` `review:approve`
- `finding:create` `finding:assign` `finding:resolve` `finding:close`
- `document:upload` `document:delete`
- `user:invite` `user:deactivate`
- `team:create` `team:manage`
- `org:settings`

### Permission Matrix

| Permission | super_admin | governance_admin | manager | reviewer | auditor | viewer |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| `asset:create` | ✓ | ✓ | ✓ | — | — | — |
| `asset:read` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `asset:update` | ✓ | ✓ | ✓ | — | — | — |
| `asset:delete` | ✓ | ✓ | — | — | — | — |
| `review:read` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `review:create` | ✓ | ✓ | ✓ | — | — | — |
| `review:complete` | ✓ | ✓ | ✓ | ✓ | — | — |
| `review:approve` | ✓ | ✓ | ✓ | — | — | — |
| `finding:create` | ✓ | ✓ | ✓ | ✓ | ✓ | — |
| `finding:assign` | ✓ | ✓ | ✓ | — | — | — |
| `finding:resolve` | ✓ | ✓ | ✓ | ✓ | — | — |
| `finding:close` | ✓ | ✓ | ✓ | — | — | — |
| `document:upload` | ✓ | ✓ | ✓ | ✓ | — | — |
| `document:delete` | ✓ | ✓ | — | — | — | — |
| `user:invite` | ✓ | ✓ | — | — | — | — |
| `user:deactivate` | ✓ | ✓ | — | — | — | — |
| `team:create` | ✓ | ✓ | — | — | — | — |
| `team:manage` | ✓ | ✓ | ✓ | — | — | — |
| `org:settings` | ✓ | ✓ | — | — | — | — |

---

## 6. Core Module Design

### 6.1 Asset Module

Assets are the central entity around which everything else orbits.

**Asset lifecycle:**
```
ACTIVE → UNDER_REVIEW → ACTIVE (review complete)
ACTIVE → INACTIVE (decommissioning)
INACTIVE → DECOMMISSIONED (permanent)
```

**Review due calculation:**
When an asset is created or a review is completed, the system calculates `next_review_date` based on `review_frequency`:
- `MONTHLY` → +30 days
- `QUARTERLY` → +90 days
- `SEMI_ANNUAL` → +180 days
- `ANNUAL` → +365 days
- `MANUAL` → no auto-calculation

A BullMQ repeating job runs **daily at 06:00 UTC** and:
1. Queries all assets where `next_review_date <= now() + 7 days`
2. Creates a `Review` record with status `PENDING`
3. Sends notifications to `technical_owner` and `business_owner`

### 6.2 Review Module

**Review state machine:**
```
PENDING → IN_PROGRESS (reviewer opens review)
IN_PROGRESS → COMPLETED (reviewer submits)
COMPLETED → APPROVED (manager approves)
COMPLETED → REJECTED (manager rejects → back to IN_PROGRESS)
PENDING / IN_PROGRESS → OVERDUE (scheduler marks overdue after due_date passes)
```

Every status transition is logged in `activity_logs`.

### 6.3 Findings Module

Findings are raised:
- During a review (linked to a `review_id`)
- Independently against an asset (only `asset_id`)
- By an auditor without a specific asset (standalone)

**Finding state machine:**
```
OPEN → IN_PROGRESS (assignee acknowledges)
IN_PROGRESS → RESOLVED (assignee marks resolved, uploads evidence)
RESOLVED → CLOSED (manager/admin closes)
RESOLVED → OPEN (rejected — evidence insufficient)
OPEN / IN_PROGRESS → ACCEPTED_RISK (manager accepts risk, documents rationale)
```

### 6.4 Document / Evidence Module

**Storage flow:**
1. Client requests upload URL: `POST /documents/upload-url`
2. API generates a **presigned MinIO PUT URL** (valid 15 minutes)
3. Client uploads directly to MinIO (bypasses API server bandwidth)
4. Client confirms upload: `POST /documents/confirm`
5. API creates `EvidenceDocument` record in PostgreSQL

This keeps the API server stateless with respect to file bytes.

**Supported MIME types:**
- `application/pdf`
- `application/vnd.openxmlformats-officedocument.wordprocessingml.document` (.docx)
- `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` (.xlsx)
- `image/png` `image/jpeg` `image/webp` `image/gif`

Max file size: **50MB** per file, **500MB** per organization (v1 soft limit).

### 6.5 Notification Module

**Delivery:** Email (Resend/SMTP) + In-app (database-backed, polled by frontend every 60s)

**Queue strategy:** All notification sends go through a BullMQ `notifications` queue with:
- 3 retry attempts with exponential backoff
- Dead-letter queue for failed sends
- Rate limiting: max 100 emails/min per tenant

**Trigger events:**
| Event | Recipients |
|---|---|
| Review due (7 days out) | Technical owner, Business owner |
| Review overdue | Technical owner, Business owner, Manager |
| Finding assigned | Assignee |
| Finding due (3 days out) | Assignee |
| Finding overdue | Assignee, Manager |
| Asset SSL expiring (30 days) | Technical owner |

### 6.6 Activity Log Module

**Immutable append-only log.** No updates, no deletes (not even via `super_admin`).

```
{
  action:     "review.approved",
  entityType: "review",
  entityId:   "clx...",
  entityName: "Q2 2026 Review — Production API Server",
  userId:     "clx...",
  changes:    { status: { from: "COMPLETED", to: "APPROVED" } },
  metadata:   { ipAddress: "203.0.113.1", userAgent: "..." }
}
```

---

## 7. Dashboard Metrics Design

All dashboard metrics are computed via **database aggregation queries** (not materialized views in v1). For v1 load, this is sufficient. Cached in Redis with 5-minute TTL per `organizationId`.

| Metric | Query |
|---|---|
| Total Assets | `COUNT(*) WHERE org_id = ? AND status != DECOMMISSIONED` |
| Assets by Type | `GROUP BY asset_type` |
| Reviews Due (next 30d) | `COUNT(*) WHERE due_date BETWEEN now() AND now()+30d` |
| Overdue Reviews | `COUNT(*) WHERE status = OVERDUE` |
| Open Findings | `COUNT(*) WHERE status IN (OPEN, IN_PROGRESS)` |
| Critical Findings | `COUNT(*) WHERE severity = CRITICAL AND status = OPEN` |
| SSL/Cert Expiring 30d | `COUNT(*) WHERE asset_type = SSL_CERTIFICATE AND expires_at < now()+30d` |
| Recent Activity | `ORDER BY created_at DESC LIMIT 20` |

---

## 8. API Design Principles

- **RESTful** with consistent resource naming
- **Base path:** `/api/v1/`
- **Versioning:** URL path (v1, v2) — not headers
- **Response envelope:**
  ```json
  {
    "data": { ... },
    "meta": { "page": 1, "limit": 25, "total": 150 },
    "success": true
  }
  ```
- **Error envelope:**
  ```json
  {
    "success": false,
    "error": {
      "code": "ASSET_NOT_FOUND",
      "message": "The requested asset does not exist.",
      "statusCode": 404
    }
  }
  ```
- **Pagination:** Cursor-based for activity logs, offset-based for everything else
- **Filtering:** Query params `?status=OPEN&severity=CRITICAL&page=1&limit=25`
- **Sorting:** `?sort=createdAt&order=desc`

---

## 9. Key Design Decisions & Rationale

| Decision | Choice | Why |
|---|---|---|
| ORM | Prisma 7 | Type-safe, excellent DX, migrations work well with PostgreSQL |
| Queue | BullMQ | Battle-tested, Redis-backed, repeatable jobs for scheduling |
| File storage | MinIO presigned URLs | Keeps API server stateless, swap to S3 without code change |
| Multi-tenancy | Shared DB, row isolation | Fastest to build, easiest to debug, RLS upgradeable later |
| Auth | JWT + refresh rotation | Stateless access, revocable refresh, no session DB overhead |
| Email | Resend (primary) + SMTP fallback | Resend has excellent deliverability; SMTP for self-hosted |
| Frontend state | TanStack Query + Zustand | Server state in TQ, client/UI state in Zustand — no Redux |
| Monorepo | Turborepo + pnpm workspaces | Shared types/validators between FE and BE from day one |

---

## 10. What Is Explicitly Deferred (v1.1+)

| Feature | Why Deferred |
|---|---|
| PostgreSQL Row-Level Security | Requires RLS policies per table; overkill for v1 user count |
| SSO / SAML / OAuth | Complex; enterprise customers will ask for it in v1.1 |
| Multiple orgs per tenant | Adds join complexity; 1:1 covers all v1 customers |
| Custom roles | The 6 system roles cover 95% of use cases |
| Webhooks | Nice-to-have; not blocking any v1 workflow |
| CSV export | Useful but not governance-critical |
| Advanced reporting / PDF reports | v1.1 differentiator |
| API rate limiting per tenant | Redis token bucket — add in v1.1 before public launch |
| Mobile app | Out of scope per brief |
| AI/LLM features | Out of scope per brief |

---

*Architecture doc ends. See companion files:*
- `BYUND_SCHEMA.prisma` — complete Prisma 7 schema
- `BYUND_FOLDER_STRUCTURE.md` — annotated monorepo directory tree
- `BYUND_API_CONTRACT.md` — full endpoint list + permission matrix
- `BYUND_ROADMAP.md` — 90-day sprint plan
