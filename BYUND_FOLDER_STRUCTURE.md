# BYUND Governance — Monorepo Folder Structure
### NIPPYSKY LIMITED · Version 1.0

Turborepo + pnpm workspaces. Two apps, two shared packages.

---

```
byund-governance/                         ← Monorepo root
│
├── package.json                          ← pnpm workspace root
├── pnpm-workspace.yaml
├── turbo.json                            ← Turborepo pipeline config
├── .env.example                          ← Env var template (committed)
├── .gitignore
├── docker-compose.yml                    ← Dev: postgres, redis, minio
├── docker-compose.prod.yml               ← Prod: adds nginx, all services
│
├── apps/
│   ├── web/                              ← Next.js 16 frontend
│   │   ├── package.json
│   │   ├── next.config.ts
│   │   ├── tailwind.config.ts            ← Tailwind 4 with custom design tokens
│   │   ├── tsconfig.json
│   │   ├── public/
│   │   │   ├── logo.svg
│   │   │   └── favicon.ico
│   │   └── src/
│   │       ├── app/                      ← Next.js App Router
│   │       │   ├── layout.tsx            ← Root layout (theme provider, fonts)
│   │       │   ├── page.tsx              ← Marketing/landing (redirects to /login)
│   │       │   ├── globals.css           ← Tailwind 4 base + design tokens
│   │       │   │
│   │       │   ├── (auth)/               ← Route group — no sidebar layout
│   │       │   │   ├── layout.tsx        ← Centered auth card layout
│   │       │   │   ├── login/
│   │       │   │   │   └── page.tsx
│   │       │   │   ├── register/
│   │       │   │   │   └── page.tsx
│   │       │   │   └── forgot-password/
│   │       │   │       └── page.tsx
│   │       │   │
│   │       │   └── (app)/                ← Route group — full dashboard layout
│   │       │       ├── layout.tsx        ← Sidebar + header shell
│   │       │       │
│   │       │       ├── dashboard/
│   │       │       │   └── page.tsx      ← Metrics, charts, recent activity
│   │       │       │
│   │       │       ├── assets/
│   │       │       │   ├── page.tsx      ← Asset list, filter, search
│   │       │       │   ├── new/
│   │       │       │   │   └── page.tsx  ← Create asset form
│   │       │       │   └── [id]/
│   │       │       │       ├── page.tsx  ← Asset detail
│   │       │       │       ├── reviews/
│   │       │       │       │   └── page.tsx
│   │       │       │       └── findings/
│   │       │       │           └── page.tsx
│   │       │       │
│   │       │       ├── reviews/
│   │       │       │   ├── page.tsx      ← All reviews (filter by status/type)
│   │       │       │   └── [id]/
│   │       │       │       └── page.tsx  ← Review detail + complete/approve actions
│   │       │       │
│   │       │       ├── findings/
│   │       │       │   ├── page.tsx      ← Findings board / list
│   │       │       │   ├── new/
│   │       │       │   │   └── page.tsx
│   │       │       │   └── [id]/
│   │       │       │       └── page.tsx  ← Finding detail + evidence + timeline
│   │       │       │
│   │       │       ├── documents/
│   │       │       │   └── page.tsx      ← Document library
│   │       │       │
│   │       │       ├── teams/
│   │       │       │   ├── page.tsx
│   │       │       │   └── [id]/
│   │       │       │       └── page.tsx
│   │       │       │
│   │       │       ├── users/
│   │       │       │   ├── page.tsx      ← User management (invite, deactivate)
│   │       │       │   └── [id]/
│   │       │       │       └── page.tsx
│   │       │       │
│   │       │       ├── activity/
│   │       │       │   └── page.tsx      ← Full activity log
│   │       │       │
│   │       │       └── settings/
│   │       │           ├── page.tsx      ← Org settings
│   │       │           ├── profile/
│   │       │           │   └── page.tsx
│   │       │           └── notifications/
│   │       │               └── page.tsx
│   │       │
│   │       ├── components/
│   │       │   ├── ui/                   ← Custom design system (zero shadcn)
│   │       │   │   ├── button.tsx        ← 5 variants: primary / secondary / ghost / danger / outline
│   │       │   │   ├── input.tsx
│   │       │   │   ├── textarea.tsx
│   │       │   │   ├── select.tsx
│   │       │   │   ├── checkbox.tsx
│   │       │   │   ├── badge.tsx         ← Status / severity / type badges
│   │       │   │   ├── card.tsx
│   │       │   │   ├── modal.tsx
│   │       │   │   ├── drawer.tsx
│   │       │   │   ├── table.tsx         ← Sortable, paginated
│   │       │   │   ├── pagination.tsx
│   │       │   │   ├── dropdown.tsx
│   │       │   │   ├── popover.tsx
│   │       │   │   ├── tooltip.tsx
│   │       │   │   ├── toast.tsx
│   │       │   │   ├── avatar.tsx
│   │       │   │   ├── skeleton.tsx
│   │       │   │   ├── spinner.tsx
│   │       │   │   ├── divider.tsx
│   │       │   │   ├── empty-state.tsx
│   │       │   │   ├── stat-card.tsx     ← Dashboard metric card
│   │       │   │   └── index.ts          ← Barrel export
│   │       │   │
│   │       │   ├── layout/
│   │       │   │   ├── app-shell.tsx     ← Sidebar + header composition
│   │       │   │   ├── sidebar.tsx       ← Nav items, org switcher, user menu
│   │       │   │   ├── header.tsx        ← Page title, breadcrumbs, notifications bell
│   │       │   │   └── breadcrumbs.tsx
│   │       │   │
│   │       │   ├── dashboard/
│   │       │   │   ├── metrics-grid.tsx
│   │       │   │   ├── assets-by-type-chart.tsx
│   │       │   │   ├── reviews-timeline.tsx
│   │       │   │   └── recent-activity-feed.tsx
│   │       │   │
│   │       │   ├── assets/
│   │       │   │   ├── asset-form.tsx
│   │       │   │   ├── asset-table.tsx
│   │       │   │   ├── asset-filters.tsx
│   │       │   │   ├── asset-type-icon.tsx
│   │       │   │   └── asset-detail-header.tsx
│   │       │   │
│   │       │   ├── reviews/
│   │       │   │   ├── review-card.tsx
│   │       │   │   ├── review-form.tsx
│   │       │   │   ├── review-status-badge.tsx
│   │       │   │   └── review-timeline.tsx
│   │       │   │
│   │       │   ├── findings/
│   │       │   │   ├── finding-form.tsx
│   │       │   │   ├── finding-board.tsx
│   │       │   │   ├── finding-severity-badge.tsx
│   │       │   │   └── finding-status-badge.tsx
│   │       │   │
│   │       │   ├── documents/
│   │       │   │   ├── document-uploader.tsx ← Presigned URL upload flow
│   │       │   │   ├── document-list.tsx
│   │       │   │   └── document-preview.tsx
│   │       │   │
│   │       │   └── notifications/
│   │       │       ├── notification-bell.tsx
│   │       │       └── notification-drawer.tsx
│   │       │
│   │       ├── hooks/
│   │       │   ├── use-auth.ts
│   │       │   ├── use-assets.ts         ← TanStack Query hooks
│   │       │   ├── use-reviews.ts
│   │       │   ├── use-findings.ts
│   │       │   ├── use-documents.ts
│   │       │   ├── use-notifications.ts
│   │       │   ├── use-dashboard.ts
│   │       │   └── use-debounce.ts
│   │       │
│   │       ├── stores/                   ← Zustand stores (client-only state)
│   │       │   ├── auth.store.ts         ← { user, accessToken, logout }
│   │       │   ├── ui.store.ts           ← { theme, sidebarOpen }
│   │       │   └── notifications.store.ts
│   │       │
│   │       ├── lib/
│   │       │   ├── api-client.ts         ← Axios instance with interceptors
│   │       │   ├── query-client.ts       ← TanStack Query client config
│   │       │   ├── auth.ts               ← Token refresh logic
│   │       │   └── utils.ts              ← cn(), formatDate(), truncate()
│   │       │
│   │       ├── types/
│   │       │   └── index.ts              ← Re-exports from @byund/types
│   │       │
│   │       └── middleware.ts             ← Next.js middleware (auth redirect)
│   │
│   └── api/                              ← NestJS 11 backend
│       ├── package.json
│       ├── tsconfig.json
│       ├── nest-cli.json
│       └── src/
│           ├── main.ts                   ← Bootstrap, global pipes, Swagger
│           ├── app.module.ts             ← Root module
│           │
│           ├── config/
│           │   ├── app.config.ts
│           │   ├── database.config.ts
│           │   ├── redis.config.ts
│           │   ├── storage.config.ts
│           │   ├── mail.config.ts
│           │   └── index.ts
│           │
│           ├── common/
│           │   ├── decorators/
│           │   │   ├── current-user.decorator.ts
│           │   │   ├── permissions.decorator.ts
│           │   │   └── tenant.decorator.ts
│           │   ├── guards/
│           │   │   ├── jwt-auth.guard.ts
│           │   │   ├── permissions.guard.ts
│           │   │   └── tenant.guard.ts
│           │   ├── filters/
│           │   │   └── http-exception.filter.ts  ← Consistent error envelope
│           │   ├── interceptors/
│           │   │   ├── response.interceptor.ts   ← Wraps data in { data, success }
│           │   │   └── activity-log.interceptor.ts
│           │   ├── pipes/
│           │   │   └── zod-validation.pipe.ts
│           │   ├── middleware/
│           │   │   └── tenant-context.middleware.ts
│           │   └── types/
│           │       └── request-with-user.ts
│           │
│           ├── database/
│           │   ├── prisma.module.ts
│           │   ├── prisma.service.ts
│           │   └── seed/
│           │       ├── seed.ts           ← Roles, permissions, super admin
│           │       ├── roles.seed.ts
│           │       └── permissions.seed.ts
│           │
│           ├── queue/
│           │   ├── queue.module.ts
│           │   ├── processors/
│           │   │   ├── review-scheduler.processor.ts
│           │   │   └── notification.processor.ts
│           │   └── jobs/
│           │       ├── review-due.job.ts
│           │       └── send-notification.job.ts
│           │
│           ├── storage/
│           │   ├── storage.module.ts
│           │   └── storage.service.ts    ← MinIO presigned URL generation
│           │
│           ├── mail/
│           │   ├── mail.module.ts
│           │   ├── mail.service.ts
│           │   └── templates/
│           │       ├── review-due.html
│           │       ├── finding-assigned.html
│           │       └── welcome.html
│           │
│           └── modules/
│               ├── auth/
│               │   ├── auth.module.ts
│               │   ├── auth.controller.ts
│               │   ├── auth.service.ts
│               │   ├── strategies/
│               │   │   ├── jwt.strategy.ts
│               │   │   └── local.strategy.ts
│               │   └── dto/
│               │       ├── login.dto.ts
│               │       └── register.dto.ts
│               │
│               ├── tenants/
│               │   ├── tenants.module.ts
│               │   ├── tenants.controller.ts
│               │   ├── tenants.service.ts
│               │   └── dto/
│               │
│               ├── organizations/
│               │   ├── organizations.module.ts
│               │   ├── organizations.controller.ts
│               │   ├── organizations.service.ts
│               │   └── dto/
│               │
│               ├── teams/
│               │   ├── teams.module.ts
│               │   ├── teams.controller.ts
│               │   ├── teams.service.ts
│               │   └── dto/
│               │
│               ├── users/
│               │   ├── users.module.ts
│               │   ├── users.controller.ts
│               │   ├── users.service.ts
│               │   └── dto/
│               │
│               ├── roles/
│               │   ├── roles.module.ts
│               │   ├── roles.controller.ts
│               │   └── roles.service.ts
│               │
│               ├── assets/
│               │   ├── assets.module.ts
│               │   ├── assets.controller.ts
│               │   ├── assets.service.ts
│               │   └── dto/
│               │       ├── create-asset.dto.ts
│               │       ├── update-asset.dto.ts
│               │       └── asset-query.dto.ts
│               │
│               ├── reviews/
│               │   ├── reviews.module.ts
│               │   ├── reviews.controller.ts
│               │   ├── reviews.service.ts
│               │   └── dto/
│               │       ├── create-review.dto.ts
│               │       ├── complete-review.dto.ts
│               │       └── approve-review.dto.ts
│               │
│               ├── findings/
│               │   ├── findings.module.ts
│               │   ├── findings.controller.ts
│               │   ├── findings.service.ts
│               │   └── dto/
│               │       ├── create-finding.dto.ts
│               │       ├── update-finding.dto.ts
│               │       └── resolve-finding.dto.ts
│               │
│               ├── documents/
│               │   ├── documents.module.ts
│               │   ├── documents.controller.ts
│               │   ├── documents.service.ts
│               │   └── dto/
│               │       ├── request-upload-url.dto.ts
│               │       └── confirm-upload.dto.ts
│               │
│               ├── notifications/
│               │   ├── notifications.module.ts
│               │   ├── notifications.controller.ts
│               │   └── notifications.service.ts
│               │
│               ├── activity-logs/
│               │   ├── activity-logs.module.ts
│               │   ├── activity-logs.controller.ts
│               │   └── activity-logs.service.ts
│               │
│               └── dashboard/
│                   ├── dashboard.module.ts
│                   ├── dashboard.controller.ts
│                   └── dashboard.service.ts
│
├── packages/
│   ├── types/                            ← Shared TypeScript types (FE + BE consume)
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── asset.types.ts
│   │       ├── review.types.ts
│   │       ├── finding.types.ts
│   │       ├── user.types.ts
│   │       ├── notification.types.ts
│   │       └── index.ts
│   │
│   └── validators/                       ← Shared Zod schemas (FE forms + BE DTOs)
│       ├── package.json
│       ├── tsconfig.json
│       └── src/
│           ├── asset.schema.ts
│           ├── review.schema.ts
│           ├── finding.schema.ts
│           ├── auth.schema.ts
│           └── index.ts
│
├── infra/
│   ├── nginx/
│   │   ├── nginx.conf
│   │   └── ssl/                          ← TLS certs (gitignored)
│   ├── minio/
│   │   └── init-buckets.sh               ← Creates byund-evidence, byund-assets buckets
│   └── postgres/
│       └── init.sql                      ← Extensions: uuid-ossp, pg_trgm
│
└── .github/
    └── workflows/
        ├── ci.yml                        ← Lint, type-check, test on PR
        └── deploy.yml                    ← Build + push Docker images on main merge
```

---

## Key Structural Decisions

**Why `packages/types` and `packages/validators`?**

The same Zod schema that validates a form field in Next.js also validates the DTO in NestJS. Define once, import in both. No drift between FE validation and BE validation.

**Why route groups `(auth)` and `(app)`?**

Next.js App Router route groups share a layout without affecting the URL. Auth pages get a minimal centered layout. Dashboard pages get the sidebar shell. No conditional layout logic needed.

**Why one `storage.service.ts` in the backend?**

All MinIO interactions are isolated here. Swap MinIO for AWS S3 or Cloudflare R2 by changing this single file. The presigned URL approach means the API server never handles file bytes — just metadata.

**Why `queue/processors/` separate from `modules/`?**

BullMQ processors run in separate worker threads. Keeping them outside the main module tree makes it easy to extract them to a dedicated worker process in v1.1 without restructuring.
