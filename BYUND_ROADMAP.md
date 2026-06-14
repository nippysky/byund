# BYUND Governance — 90-Day MVP Roadmap
### NIPPYSKY LIMITED · Version 1.0
### Solo Founder Build Plan · June – September 2026

---

## Guiding Principle

> Ship the smallest thing that a real IT team can use on day one.
> Every feature not in this plan is a feature you can sell as a v1.1 upgrade.

---

## Sprint 0 — Foundation (Days 1–7)

**Goal:** Monorepo boots, connects to all services, CI/CD runs.

| Task | Output |
|---|---|
| Init Turborepo + pnpm workspaces | `package.json`, `pnpm-workspace.yaml`, `turbo.json` |
| Init Next.js 16 app with Tailwind 4 | `apps/web` running on localhost:3000 |
| Init NestJS 11 app | `apps/api` running on localhost:4000 |
| Init `packages/types` and `packages/validators` | Shared Zod schemas compile in both apps |
| Docker Compose: PostgreSQL 16, Redis 7, MinIO | `docker-compose.yml` — one `docker compose up` boots everything |
| Prisma 7 schema + first migration | All tables created in dev DB |
| Seed script | 6 system roles, all permissions, one test tenant + org + admin user |
| GitHub Actions CI | Lint + type-check + migrate on every PR |
| Nginx config | Reverse proxy to api:4000 and web:3000 |

**Done when:** `docker compose up` → browse localhost → see Next.js app → API health check returns `{ ok: true }`.

---

## Sprint 1 — Auth + Org Shell (Days 8–21)

**Goal:** A real user can register, log in, and see a working dashboard shell.

### Backend
| Task | Endpoints |
|---|---|
| Auth module: register, login, refresh, logout | POST /auth/register, /auth/login, /auth/refresh, /auth/logout |
| JWT strategy + refresh token rotation | Passport JWT, bcrypt, 15min/7d tokens |
| TenantContextMiddleware | Injects tenant on every request |
| PermissionsGuard | `@RequirePermissions('asset:create')` decorator |
| Users module: invite, list, get, status | GET/PATCH /users |
| Teams module: CRUD + membership | GET/POST/PATCH /teams |
| Roles module: list, assign to user | GET /roles, POST /users/:id/roles |
| Activity log service | Logs every mutation automatically via interceptor |

### Frontend
| Task | Component |
|---|---|
| Design token system | CSS variables: `--color-surface`, `--color-brand`, `--radius-md`, etc. |
| Core UI kit | Button, Input, Badge, Card, Modal, Table, Toast, Skeleton, EmptyState |
| Auth layout + login page | `/login` — email/password form, error states |
| Register page | `/register` — tenant name, org name, admin email/password |
| Zustand auth store | `{ user, accessToken }` with refresh token interceptor |
| App shell layout | Sidebar, header, breadcrumbs |
| Users page | List, invite modal, role assignment |
| Teams page | List, create, manage members |
| Settings / profile | Update name, avatar, password |

**Done when:** New user registers → logs in → sees sidebar with empty modules → can invite a colleague → colleague logs in with correct role.

---

## Sprint 2 — Assets + Reviews (Days 22–49)

**Goal:** Core governance loop works end-to-end. An asset can be created, reviewed, and the review approved with evidence.

### Backend
| Task | Endpoints |
|---|---|
| Assets module: full CRUD | GET/POST/PATCH/DELETE /assets |
| Asset filtering + search | `pg_trgm` index on name for fuzzy search |
| Review module: CRUD + state machine | GET/POST /reviews, /reviews/:id/start, complete, approve, reject |
| ReviewSchedule: BullMQ repeating job | Daily 06:00 UTC job creates reviews for due assets |
| Documents module: presigned URLs | POST /documents/upload-url, /confirm, GET /download-url |
| Storage service: MinIO integration | `storage.service.ts` — presigned PUT/GET |
| Dashboard metrics endpoint | GET /dashboard/metrics (Redis 5min cache) |
| Notifications service (in-app) | Create notification records on review events |

### Frontend
| Task | Page/Component |
|---|---|
| Dashboard page | Metrics grid, assets-by-type chart, recent activity feed, expiring assets |
| Asset list page | Table with filters, search, risk badge, type icon, next review date |
| Create asset form | All fields, owner selectors (user picker), type selector |
| Asset detail page | Header with status, tabs: Overview / Reviews / Findings / Documents |
| Review list page | Filter by status, type, date; assigned-to-me view |
| Review detail page | Status stepper, reviewer notes form, approve/reject actions |
| Document uploader component | Drag-drop → presigned URL → MinIO → confirm → show in list |
| Notification bell | In-app badge + drawer with unread items |

**Done when:** Create a server asset → quarterly review fires → reviewer completes review with uploaded evidence → manager approves → next review date auto-updates → activity log shows full trail.

---

## Sprint 3 — Findings + Polish + Launch Prep (Days 50–75)

**Goal:** Findings module complete. Product is polished enough to demo to a paying customer.

### Backend
| Task | Endpoints |
|---|---|
| Findings module: full state machine | GET/POST /findings + all state transitions |
| Finding assignment + email notification | BullMQ email job via Resend |
| Email notifications for reviews + findings | All 6 trigger types from spec |
| Activity log endpoint | GET /activity with full filtering |
| Overdue checker job | Daily job marks PENDING/IN_PROGRESS reviews OVERDUE |
| Asset expiry checker job | Daily job triggers ASSET_EXPIRING notifications |
| Swagger/OpenAPI docs | Auto-generated from NestJS decorators |
| Rate limiting (basic) | `@nestjs/throttler` — 100 req/min per IP |

### Frontend
| Task | Page/Component |
|---|---|
| Findings list page | Table + severity colour coding; filter by status/severity/team |
| Finding detail page | Status timeline, remediation plan, evidence uploads, assignee |
| Create finding form | From standalone + from within review detail |
| Activity log page | Full timeline with entity links |
| Dark mode | CSS variable swap; persist preference in Zustand + localStorage |
| Responsive design | Sidebar collapses to hamburger on mobile-width |
| Empty states | All list pages have on-brand empty states |
| Error boundaries | Graceful degradation on API failures |
| Loading skeletons | All data-fetching routes use skeleton placeholders |

**Done when:** Full governance loop works. Asset → scheduled review → reviewer completes → manager approves → finding raised → finding assigned → team resolves with evidence → finding closed → activity log shows everything.

---

## Buffer + Launch (Days 76–90)

| Task | Why |
|---|---|
| Bug bash | Invite 3 beta users, collect feedback |
| Production Docker Compose setup | `docker-compose.prod.yml` with env var hardening |
| MinIO bucket policies | Public-read blocked, presigned-only access |
| Backup strategy | PostgreSQL daily pg_dump to MinIO `byund-backups` bucket |
| Health check endpoints | `GET /health` → Postgres ping + Redis ping |
| Basic monitoring | Docker logging to file; set up Sentry for error tracking |
| Privacy policy + ToS | Required for any paying customer |
| Landing page | Simple Next.js marketing page (5 sections, waitlist/contact CTA) |
| First paying customer outreach | 10 warm contacts from network |

---

## What Ships in v1.0

| Module | Status |
|---|---|
| Multi-tenant auth (JWT + refresh) | ✅ Sprint 1 |
| Organizations | ✅ Sprint 1 |
| Teams | ✅ Sprint 1 |
| Users + RBAC | ✅ Sprint 1 |
| Assets (9 types) | ✅ Sprint 2 |
| Reviews (all types + workflow) | ✅ Sprint 2 |
| Evidence / Documents | ✅ Sprint 2 |
| Dashboard metrics | ✅ Sprint 2 |
| In-app notifications | ✅ Sprint 2 |
| Audit Findings | ✅ Sprint 3 |
| Email notifications | ✅ Sprint 3 |
| Activity log | ✅ Sprint 3 |
| Dark/light mode | ✅ Sprint 3 |
| Automated review scheduling | ✅ Sprint 3 |

---

## Deferred to v1.1 (Do Not Build Now)

| Feature | When | Why Wait |
|---|---|---|
| SSO / SAML | v1.1 | Enterprise blocker, but first 10 customers won't need it |
| CSV/PDF export | v1.1 | Nice-to-have; users can screenshot |
| Custom roles | v1.1 | 6 system roles cover all v1 use cases |
| Multiple orgs per tenant | v1.1 | 1:1 covers all solo-founder customers |
| Webhooks | v1.1 | No integrations to push to yet |
| PostgreSQL Row-Level Security | v1.1 | Current row filtering is sufficient for v1 scale |
| Advanced analytics | v1.2 | Needs data volume to be meaningful |
| Mobile app | Never (per spec) | |
| AI features | Never (per spec) | |

---

## Risk Register

| Risk | Likelihood | Mitigation |
|---|---|---|
| Scope creep → delay | High | This doc is the scope lock. If it's not in Sprint 1-3, it waits. |
| MinIO operational complexity | Medium | Use MinIO Play for dev; production MinIO is single-node |
| Email deliverability | Medium | Use Resend (excellent deliverability) not raw SMTP |
| Solo founder burnout | High | Sprint 0 is infrastructure only — no UI pressure |
| First customer onboarding friction | Medium | Build a guided setup flow in v1.1 |
