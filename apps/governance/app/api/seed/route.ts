/**
 * POST /api/seed
 * Seeds rich demo data into the workspace. Only works in non-production
 * OR when ALLOW_SEED=true env var is set.
 * Safe to call multiple times (checks for existing seed).
 */
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { subDays, addDays } from "date-fns";

const guard = () => {
  if (process.env.NODE_ENV === "production" && process.env.ALLOW_SEED !== "true") {
    return NextResponse.json({ error: "Seed is disabled in production" }, { status: 403 });
  }
  return null;
};

export async function POST(req: NextRequest) {
  const blocked = guard();
  if (blocked) return blocked;

  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const ws = session.workspaceId;
  const actorId = session.userId;

  // Idempotency — skip if already seeded
  const existingCount = await prisma.asset.count({ where: { workspaceId: ws } });
  if (existingCount >= 10) {
    return NextResponse.json({ ok: true, skipped: true, message: "Already seeded" });
  }

  const now = new Date();

  // ── 1. Team members ──────────────────────────────────────────────
  const memberData = [
    { name: "Sarah Chen",    email: "sarah.chen@demo.byund.com",    role: "ADMIN"   as const },
    { name: "Marcus Webb",   email: "marcus.webb@demo.byund.com",   role: "ANALYST" as const },
    { name: "Priya Nair",    email: "priya.nair@demo.byund.com",    role: "ANALYST" as const },
    { name: "Jordan Blake",  email: "jordan.blake@demo.byund.com",  role: "VIEWER"  as const },
    { name: "Alex Torres",   email: "alex.torres@demo.byund.com",   role: "VIEWER"  as const },
  ];

  const members: { id: string; name: string }[] = [];
  for (const m of memberData) {
    const user = await prisma.user.upsert({
      where:  { email: m.email },
      create: { name: m.name, email: m.email, passwordHash: "$argon2id$v=19$m=65536,t=3,p=1$demo" },
      update: {},
    });
    await prisma.workspaceMember.upsert({
      where:  { workspaceId_userId: { workspaceId: ws, userId: user.id } },
      create: { workspaceId: ws, userId: user.id, role: m.role },
      update: {},
    });
    members.push({ id: user.id, name: m.name });
  }

  const randomMember = () => members[Math.floor(Math.random() * members.length)];

  // ── 2. Assets ────────────────────────────────────────────────────
  const assetDefs = [
    { name: "Production API Gateway",      type: "SERVER"   as const, criticality: "CRITICAL" as const, description: "Kong API Gateway managing all customer-facing microservices traffic. Handles 2M+ req/day." },
    { name: "Primary PostgreSQL Cluster",  type: "DATABASE" as const, criticality: "CRITICAL" as const, description: "RDS Multi-AZ PostgreSQL 15 cluster. Stores all transactional data for BYUND platform." },
    { name: "Customer Auth Service",       type: "API_KEY"  as const, criticality: "HIGH"     as const, description: "OAuth2/OIDC authentication service. Manages JWT issuance for 50k+ customers." },
    { name: "*.byund.com Wildcard TLS",    type: "SSL_CERT" as const, criticality: "HIGH"     as const, description: "Wildcard TLS certificate from DigiCert. Covers all BYUND subdomains.", expiresAt: addDays(now, 45) },
    { name: "payments.byund.com Domain",   type: "DOMAIN"   as const, criticality: "HIGH"     as const, description: "Primary payments domain. Auto-renewal configured via Route53." },
    { name: "Analytics Data Warehouse",    type: "DATABASE" as const, criticality: "HIGH"     as const, description: "Redshift cluster. Contains customer behavioral analytics, 90-day retention." },
    { name: "Stripe Restricted API Key",   type: "API_KEY"  as const, criticality: "HIGH"     as const, description: "Stripe restricted key for payment processing. Rotated quarterly." },
    { name: "CDN Edge Network",            type: "SERVER"   as const, criticality: "MEDIUM"   as const, description: "CloudFront distribution for static assets and API caching." },
    { name: "Internal Admin Dashboard",    type: "SERVER"   as const, criticality: "MEDIUM"   as const, description: "Internal Retool dashboard for ops team. Behind VPN only." },
    { name: "Email Service (SendGrid)",    type: "API_KEY"  as const, criticality: "MEDIUM"   as const, description: "SendGrid API key for transactional emails. 500k emails/month." },
    { name: "Redis Cache Cluster",         type: "SERVER"   as const, criticality: "MEDIUM"   as const, description: "ElastiCache Redis 7.0 cluster for session caching and rate limiting." },
    { name: "Mobile Push Notifications",   type: "API_KEY"  as const, criticality: "MEDIUM"   as const, description: "Firebase Cloud Messaging API key for iOS & Android push notifications." },
    { name: "staging.byund.com Domain",    type: "DOMAIN"   as const, criticality: "LOW"      as const, description: "Staging environment domain. Mirrors production for QA testing." },
    { name: "dev.byund.com TLS Cert",      type: "SSL_CERT" as const, criticality: "LOW"      as const, description: "Dev/staging TLS cert from Let's Encrypt. Auto-renews every 90 days.", expiresAt: addDays(now, 12) },
    { name: "GitHub Actions Bot Token",    type: "API_KEY"  as const, criticality: "LOW"      as const, description: "GitHub PAT for CI/CD pipeline. Read-only access to repos." },
    { name: "Log Aggregation Service",     type: "SERVER"   as const, criticality: "LOW"      as const, description: "Datadog agent for log aggregation. 30-day retention." },
    { name: "Backup Storage S3 Bucket",    type: "DATABASE" as const, criticality: "MEDIUM"   as const, description: "S3 bucket storing encrypted database backups. 12-month retention." },
    { name: "Internal SSO (Okta)",         type: "API_KEY"  as const, criticality: "CRITICAL" as const, description: "Okta SAML/SSO configuration for all internal tooling access." },
    { name: "Kubernetes Prod Cluster",     type: "SERVER"   as const, criticality: "CRITICAL" as const, description: "EKS cluster running all production microservices. 12 nodes across 3 AZs." },
    { name: "Secrets Manager (Vault)",     type: "SERVER"   as const, criticality: "CRITICAL" as const, description: "HashiCorp Vault for secrets management. All service credentials stored here." },
  ];

  const assets: { id: string; name: string }[] = [];
  for (const a of assetDefs) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { expiresAt: _ignored, ...rest } = a as typeof assetDefs[number] & { expiresAt?: Date };
    const lastReviewDays = Math.floor(Math.random() * 180);
    const nextReviewDays = Math.floor(Math.random() * 60) - 10; // some overdue
    const asset = await prisma.asset.create({
      data: {
        workspaceId:    ws,
        ...rest,
        lastReviewedAt: subDays(now, lastReviewDays),
        nextReviewDue:  addDays(now, nextReviewDays),
      },
    });
    assets.push({ id: asset.id, name: asset.name });
  }

  // ── 3. Reviews ───────────────────────────────────────────────────
  const reviewStatuses = ["COMPLETED", "COMPLETED", "COMPLETED", "IN_PROGRESS", "UPCOMING", "OVERDUE", "DUE"] as const;
  const reviewOutcomes = ["PASSED", "MINOR_ISSUES", "MAJOR_ISSUES", null] as const;

  for (const asset of assets) {
    const statusIndex = Math.floor(Math.random() * reviewStatuses.length);
    const status      = reviewStatuses[statusIndex];
    const isCompleted = status === "COMPLETED";
    const outcome     = isCompleted ? reviewOutcomes[Math.floor(Math.random() * 3)] : null;
    const assignee    = randomMember();

    const dueAt = status === "OVERDUE"
      ? subDays(now, Math.floor(Math.random() * 30) + 1)
      : status === "DUE"
      ? addDays(now, Math.floor(Math.random() * 3))
      : addDays(now, Math.floor(Math.random() * 60) + 5);

    const scheduledAt = subDays(dueAt, 14);
    const completedAt = isCompleted ? subDays(now, Math.floor(Math.random() * 60)) : null;

    await prisma.review.create({
      data: {
        workspaceId: ws,
        assetId:     asset.id,
        status,
        outcome,
        assigneeId:  assignee.id,
        dueAt,
        scheduledAt,
        completedAt,
        notes:       isCompleted
          ? `Review completed by ${assignee.name}. ${outcome === "PASSED" ? "All controls verified and compliant." : outcome === "MINOR_ISSUES" ? "Minor gaps identified — remediation plan in progress." : "Significant findings raised. Immediate action required."}`
          : null,
      },
    });

    // Add a second historical completed review for variety
    if (Math.random() > 0.5) {
      const pastDue = subDays(now, Math.floor(Math.random() * 180) + 60);
      await prisma.review.create({
        data: {
          workspaceId: ws,
          assetId:     asset.id,
          status:      "COMPLETED",
          outcome:     reviewOutcomes[Math.floor(Math.random() * 3)],
          assigneeId:  randomMember().id,
          dueAt:       pastDue,
          scheduledAt: subDays(pastDue, 14),
          completedAt: subDays(pastDue, Math.floor(Math.random() * 5)),
        },
      });
    }
  }

  // ── 4. Findings ──────────────────────────────────────────────────
  const findingDefs = [
    { title: "Production TLS certificate expiring in 45 days",        severity: "HIGH"     as const, status: "OPEN"        as const, assetIdx: 3 },
    { title: "Dev TLS cert expires in 12 days — immediate renewal",    severity: "CRITICAL" as const, status: "OPEN"        as const, assetIdx: 13 },
    { title: "Database password rotation overdue (>90 days)",          severity: "CRITICAL" as const, status: "IN_PROGRESS" as const, assetIdx: 1 },
    { title: "API Gateway rate limiting not configured on /auth",      severity: "HIGH"     as const, status: "OPEN"        as const, assetIdx: 0 },
    { title: "Stripe API key last rotated 6 months ago",               severity: "HIGH"     as const, status: "IN_PROGRESS" as const, assetIdx: 6 },
    { title: "Redis cluster has no authentication configured",         severity: "CRITICAL" as const, status: "OPEN"        as const, assetIdx: 10 },
    { title: "Vault seal key backup missing for DR scenario",          severity: "HIGH"     as const, status: "OPEN"        as const, assetIdx: 19 },
    { title: "Kubernetes RBAC: 3 service accounts with cluster-admin", severity: "HIGH"     as const, status: "IN_PROGRESS" as const, assetIdx: 18 },
    { title: "S3 backup bucket — public ACL detected",                 severity: "CRITICAL" as const, status: "RESOLVED"   as const, assetIdx: 16 },
    { title: "Okta MFA enforcement missing for 12 internal users",     severity: "HIGH"     as const, status: "OPEN"        as const, assetIdx: 17 },
    { title: "SendGrid API key has full account access (should be restricted)", severity: "MEDIUM" as const, status: "OPEN" as const, assetIdx: 9 },
    { title: "CloudFront missing security headers (CSP, HSTS)",        severity: "MEDIUM"   as const, status: "OPEN"        as const, assetIdx: 7 },
    { title: "GitHub Actions token scope too broad — needs audit",     severity: "MEDIUM"   as const, status: "IN_PROGRESS" as const, assetIdx: 14 },
    { title: "Datadog API key stored in environment variable (should use secrets manager)", severity: "MEDIUM" as const, status: "OPEN" as const, assetIdx: 15 },
    { title: "Analytics Redshift cluster — public endpoint exposed",   severity: "CRITICAL" as const, status: "RESOLVED"   as const, assetIdx: 5 },
    { title: "Admin dashboard accessible without VPN on staging env",  severity: "HIGH"     as const, status: "RESOLVED"   as const, assetIdx: 8 },
    { title: "Firebase FCM key not environment-scoped",                severity: "LOW"      as const, status: "OPEN"        as const, assetIdx: 11 },
    { title: "Missing disaster recovery test for PostgreSQL cluster",  severity: "HIGH"     as const, status: "OPEN"        as const, assetIdx: 1 },
    { title: "Auth service refresh tokens not revokable server-side",  severity: "HIGH"     as const, status: "IN_PROGRESS" as const, assetIdx: 2 },
    { title: "CDN cache rules exposing authenticated responses",       severity: "MEDIUM"   as const, status: "OPEN"        as const, assetIdx: 7 },
    { title: "Staging domain auto-renewal not verified for 2025",      severity: "LOW"      as const, status: "OPEN"        as const, assetIdx: 12 },
    { title: "Production K8s nodes running EOL AMI (Ubuntu 20.04)",    severity: "HIGH"     as const, status: "IN_PROGRESS" as const, assetIdx: 18 },
    { title: "Log retention policy not enforced (>30 days stored)",    severity: "LOW"      as const, status: "WONT_FIX"   as const, assetIdx: 15 },
    { title: "Wildcard cert private key stored in unencrypted S3",     severity: "CRITICAL" as const, status: "RESOLVED"   as const, assetIdx: 3 },
    { title: "Payments domain DNSSEC not enabled",                     severity: "MEDIUM"   as const, status: "OPEN"        as const, assetIdx: 4 },
    { title: "Redis cluster not encrypted at rest",                    severity: "HIGH"     as const, status: "OPEN"        as const, assetIdx: 10 },
    { title: "Vault audit logging not forwarded to SIEM",              severity: "MEDIUM"   as const, status: "OPEN"        as const, assetIdx: 19 },
    { title: "Auth service missing brute-force lockout policy",        severity: "HIGH"     as const, status: "OPEN"        as const, assetIdx: 2 },
    { title: "Database connection strings hardcoded in 3 services",    severity: "CRITICAL" as const, status: "IN_PROGRESS" as const, assetIdx: 1 },
    { title: "Missing automated backup verification tests",            severity: "MEDIUM"   as const, status: "OPEN"        as const, assetIdx: 16 },
  ];

  for (const f of findingDefs) {
    const asset     = assets[f.assetIdx] ?? assets[0];
    const assignee  = Math.random() > 0.3 ? randomMember() : null;
    const createdAt = subDays(now, Math.floor(Math.random() * 90) + 1);
    const resolvedAt = (f.status === "RESOLVED")
      ? subDays(now, Math.floor(Math.random() * 30))
      : null;

    await prisma.finding.create({
      data: {
        workspaceId: ws,
        assetId:     asset.id,
        title:       f.title,
        description: generateFindingDescription(f.title, f.severity),
        severity:    f.severity,
        status:      f.status,
        assigneeId:  assignee?.id ?? null,
        resolvedAt,
        createdAt,
      },
    });
  }

  // ── 5. Audit Log ─────────────────────────────────────────────────
  const actions = [
    "ASSET_CREATED", "ASSET_UPDATED", "REVIEW_COMPLETED", "FINDING_CREATED",
    "FINDING_RESOLVED", "MEMBER_INVITED", "SETTINGS_UPDATED", "EVIDENCE_UPLOADED",
    "REVIEW_ASSIGNED", "FINDING_STATUS_CHANGED",
  ];

  for (let i = 0; i < 40; i++) {
    const asset  = assets[Math.floor(Math.random() * assets.length)];
    const member = randomMember();
    const action = actions[Math.floor(Math.random() * actions.length)];
    await prisma.auditLog.create({
      data: {
        workspaceId: ws,
        actorId:     member.id,
        action,
        targetType:  "Asset",
        targetId:    asset.id,
        targetLabel: asset.name,
        createdAt:   subDays(now, Math.floor(Math.random() * 60)),
      },
    });
  }

  // ── 6. Update workspace settings with branding ───────────────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (prisma.workspaceSettings as any).upsert({
    where:  { workspaceId: ws },
    create: {
      workspaceId:  ws,
      brandName:    "BYUND Governance",
      brandColor:   "#2563eb",
      brandLogoUrl: "https://byund.com/logo.svg",
    },
    update: {
      brandName:    "BYUND Governance",
      brandColor:   "#2563eb",
      brandLogoUrl: "https://byund.com/logo.svg",
    },
  });

  return NextResponse.json({
    ok:      true,
    seeded:  true,
    counts: {
      assets:   assets.length,
      findings: findingDefs.length,
      members:  memberData.length,
    },
  });
}

function generateFindingDescription(title: string, severity: string): string {
  const urgency = severity === "CRITICAL"
    ? "This is a critical security issue requiring immediate remediation."
    : severity === "HIGH"
    ? "This finding poses significant risk and should be addressed within 30 days."
    : severity === "MEDIUM"
    ? "This is a medium-priority issue. Address within 60 days."
    : "Low-priority finding. Address at next scheduled maintenance window.";

  return `${title}.\n\nThis finding was identified during routine security review of the asset inventory. ${urgency}\n\nRemediation steps should be documented and tracked through to completion. Evidence of remediation must be uploaded before this finding can be marked resolved.`;
}
