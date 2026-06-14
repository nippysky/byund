# BYUND Governance — API Contract
### NIPPYSKY LIMITED · Version 1.0
### Base URL: `/api/v1`

All endpoints require `Authorization: Bearer <accessToken>` unless marked `[public]`.
All endpoints are tenant-scoped via the JWT claim `tenantId` + `organizationId`.

---

## Authentication

| Method | Path | Description | Auth |
|---|---|---|---|
| POST | `/auth/register` | Create new tenant + first admin user | [public] |
| POST | `/auth/login` | Email/password login → tokens | [public] |
| POST | `/auth/refresh` | Rotate refresh token | [public] |
| POST | `/auth/logout` | Revoke refresh token | JWT |
| GET | `/auth/me` | Get current user + roles | JWT |
| POST | `/auth/forgot-password` | Send reset email | [public] |
| POST | `/auth/reset-password` | Apply new password with reset token | [public] |

---

## Organizations

| Method | Path | Description | Permission |
|---|---|---|---|
| GET | `/organizations/current` | Get own org details | authenticated |
| PATCH | `/organizations/current` | Update org name, logo, industry | `org:settings` |

---

## Teams

| Method | Path | Description | Permission |
|---|---|---|---|
| GET | `/teams` | List all teams in org | authenticated |
| POST | `/teams` | Create team | `team:create` |
| GET | `/teams/:id` | Get team + members | authenticated |
| PATCH | `/teams/:id` | Update team name/type | `team:manage` |
| DELETE | `/teams/:id` | Deactivate team | `team:create` |
| POST | `/teams/:id/members` | Add user to team | `team:manage` |
| DELETE | `/teams/:id/members/:userId` | Remove user from team | `team:manage` |

---

## Users

| Method | Path | Description | Permission |
|---|---|---|---|
| GET | `/users` | List org users (paginated) | authenticated |
| POST | `/users/invite` | Invite user by email | `user:invite` |
| GET | `/users/:id` | Get user profile | authenticated |
| PATCH | `/users/:id` | Update user details | `user:invite` or self |
| PATCH | `/users/:id/status` | Activate / deactivate user | `user:deactivate` |
| GET | `/users/:id/roles` | Get user's roles | `user:invite` |
| POST | `/users/:id/roles` | Assign role to user | `user:invite` |
| DELETE | `/users/:id/roles/:roleId` | Remove role from user | `user:invite` |

---

## Roles & Permissions

| Method | Path | Description | Permission |
|---|---|---|---|
| GET | `/roles` | List all roles | authenticated |
| GET | `/permissions` | List all permissions | `user:invite` |

---

## Assets

| Method | Path | Description | Permission |
|---|---|---|---|
| GET | `/assets` | List assets (filter, search, paginate) | `asset:read` |
| POST | `/assets` | Create asset | `asset:create` |
| GET | `/assets/:id` | Get asset detail | `asset:read` |
| PATCH | `/assets/:id` | Update asset | `asset:update` |
| DELETE | `/assets/:id` | Soft-delete (→ DECOMMISSIONED) | `asset:delete` |
| GET | `/assets/:id/reviews` | List reviews for asset | `review:read` |
| GET | `/assets/:id/findings` | List findings for asset | `finding:read` |
| GET | `/assets/:id/documents` | List documents for asset | `document:read` |
| GET | `/assets/:id/activity` | Asset activity log | `asset:read` |

**Query params for GET /assets:**
```
?search=production-api        ← full-text search on name/description
&type=SERVER,APPLICATION      ← comma-separated AssetType filter
&status=ACTIVE                ← AssetStatus filter
&riskRating=CRITICAL,HIGH     ← RiskRating filter
&environment=PRODUCTION       ← Environment filter
&reviewDueBefore=2026-07-01   ← next_review_date filter
&teamId=clx...                ← owned by team
&ownerId=clx...               ← technical or business owner
&page=1&limit=25
&sort=nextReviewDate&order=asc
```

---

## Reviews

| Method | Path | Description | Permission |
|---|---|---|---|
| GET | `/reviews` | List all reviews (org-wide, filter) | `review:read` |
| POST | `/reviews` | Create manual review | `review:create` |
| GET | `/reviews/:id` | Get review detail | `review:read` |
| PATCH | `/reviews/:id` | Update review (notes, assignment) | `review:create` |
| POST | `/reviews/:id/start` | Mark review IN_PROGRESS | `review:complete` |
| POST | `/reviews/:id/complete` | Submit completed review | `review:complete` |
| POST | `/reviews/:id/approve` | Approve review | `review:approve` |
| POST | `/reviews/:id/reject` | Reject review (back to IN_PROGRESS) | `review:approve` |
| GET | `/reviews/:id/documents` | List review evidence | `review:read` |
| GET | `/reviews/:id/findings` | List findings raised in review | `finding:read` |
| GET | `/reviews/:id/activity` | Review audit trail | `review:read` |

**Query params for GET /reviews:**
```
?status=PENDING,OVERDUE
&type=QUARTERLY
&assetId=clx...
&assignedToId=clx...
&dueBefore=2026-09-01
&page=1&limit=25
&sort=dueDate&order=asc
```

---

## Findings

| Method | Path | Description | Permission |
|---|---|---|---|
| GET | `/findings` | List findings (filter, paginate) | `finding:read` |
| POST | `/findings` | Create finding | `finding:create` |
| GET | `/findings/:id` | Get finding detail | `finding:read` |
| PATCH | `/findings/:id` | Update finding (title, desc, plan) | `finding:assign` |
| POST | `/findings/:id/assign` | Assign to user/team | `finding:assign` |
| POST | `/findings/:id/start` | Mark IN_PROGRESS | `finding:resolve` |
| POST | `/findings/:id/resolve` | Submit resolution + evidence | `finding:resolve` |
| POST | `/findings/:id/close` | Close finding | `finding:close` |
| POST | `/findings/:id/accept-risk` | Accept risk with rationale | `finding:close` |
| GET | `/findings/:id/documents` | List finding evidence | `finding:read` |
| GET | `/findings/:id/activity` | Finding audit trail | `finding:read` |

**Query params for GET /findings:**
```
?status=OPEN,IN_PROGRESS
&severity=CRITICAL,HIGH
&assetId=clx...
&reviewId=clx...
&assignedToId=clx...
&assignedTeamId=clx...
&dueBefore=2026-08-01
&page=1&limit=25
&sort=severity&order=desc
```

---

## Documents (Evidence)

| Method | Path | Description | Permission |
|---|---|---|---|
| GET | `/documents` | List org documents (filter) | `document:read` |
| POST | `/documents/upload-url` | Request presigned MinIO PUT URL | `document:upload` |
| POST | `/documents/confirm` | Confirm upload, create DB record | `document:upload` |
| GET | `/documents/:id` | Get document metadata | `document:read` |
| GET | `/documents/:id/download-url` | Get presigned GET URL (60s TTL) | `document:read` |
| DELETE | `/documents/:id` | Delete document + storage object | `document:delete` |

**POST /documents/upload-url request body:**
```json
{
  "name": "Q2 2026 SSL Certificate Renewal Evidence",
  "originalName": "ssl-cert-renewal.pdf",
  "mimeType": "application/pdf",
  "fileSize": 245120,
  "documentType": "EVIDENCE",
  "description": "Screenshot of SSL certificate renewed on 2026-06-14",
  "assetId": "clx...",       // at least one of these
  "reviewId": "clx...",      // required
  "findingId": "clx..."      // required
}
```

**POST /documents/upload-url response:**
```json
{
  "data": {
    "uploadId": "clx...",
    "presignedUrl": "https://minio.byund.internal/byund-evidence/tenants/.../...",
    "expiresAt": "2026-06-14T12:15:00Z"
  }
}
```

---

## Notifications

| Method | Path | Description | Permission |
|---|---|---|---|
| GET | `/notifications` | List my notifications (paginated) | authenticated |
| GET | `/notifications/unread-count` | Count unread | authenticated |
| PATCH | `/notifications/:id/read` | Mark one as read | authenticated |
| POST | `/notifications/read-all` | Mark all as read | authenticated |

---

## Activity Logs

| Method | Path | Description | Permission |
|---|---|---|---|
| GET | `/activity` | Org-wide activity log (paginated) | `asset:read` |

**Query params:**
```
?entityType=review,finding
&entityId=clx...
&userId=clx...
&from=2026-01-01&to=2026-06-30
&page=1&limit=50
```

---

## Dashboard

| Method | Path | Description | Permission |
|---|---|---|---|
| GET | `/dashboard/metrics` | All metric counts (cached 5min) | authenticated |
| GET | `/dashboard/assets-by-type` | Asset type breakdown | authenticated |
| GET | `/dashboard/reviews-timeline` | Reviews due in next 90 days | authenticated |
| GET | `/dashboard/recent-activity` | Last 20 activity events | authenticated |
| GET | `/dashboard/expiring-assets` | Assets expiring in 30 days | authenticated |

**GET /dashboard/metrics response:**
```json
{
  "data": {
    "totalAssets": 142,
    "activeAssets": 138,
    "reviewsDueNext30Days": 12,
    "overdueReviews": 3,
    "openFindings": 28,
    "criticalFindings": 4,
    "highFindings": 11,
    "expiringAssets": 2,
    "findingsResolvedThisMonth": 7
  }
}
```

---

## Standard Response Shapes

### Success (single)
```json
{
  "success": true,
  "data": { "id": "clx...", "name": "Production API Server", "..." }
}
```

### Success (list)
```json
{
  "success": true,
  "data": [ { "id": "clx...", "..." } ],
  "meta": {
    "page": 1,
    "limit": 25,
    "total": 142,
    "totalPages": 6
  }
}
```

### Error
```json
{
  "success": false,
  "error": {
    "code": "ASSET_NOT_FOUND",
    "message": "The requested asset does not exist or you do not have access.",
    "statusCode": 404
  }
}
```

### Error codes reference
| Code | HTTP | When |
|---|---|---|
| `UNAUTHORIZED` | 401 | Missing or invalid token |
| `FORBIDDEN` | 403 | Valid token but insufficient permission |
| `NOT_FOUND` | 404 | Resource not found or cross-tenant access attempt |
| `VALIDATION_ERROR` | 422 | DTO validation failed |
| `CONFLICT` | 409 | Duplicate (e.g. email already exists) |
| `INTERNAL_ERROR` | 500 | Unhandled exception |
| `ASSET_NOT_FOUND` | 404 | Asset-specific |
| `REVIEW_NOT_FOUND` | 404 | Review-specific |
| `INVALID_STATE_TRANSITION` | 422 | e.g. approving a PENDING review |
| `UPLOAD_EXPIRED` | 410 | Presigned URL has expired |
| `FILE_TOO_LARGE` | 413 | File exceeds 50MB |
| `UNSUPPORTED_MIME` | 415 | File type not permitted |
