/**
 * BYUND Governance — Development Seed Script
 *
 * Wipes the database clean and creates:
 *   - 1 admin user  (contact@nippysky.com / DevAdmin2024)
 *   - 1 workspace   "BYUND Dev"
 *   - 5 sample assets
 *   - 3 sample reviews
 *   - 3 sample findings
 *   - Audit log entries
 *
 * Run: node apps/governance/scripts/seed-dev.mjs
 */

import pg from "pg";
import bcryptjs from "bcryptjs";

const DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgresql://byund_user:ByundGov2024Secure@ops.panth.art:5432/byund_governance?sslmode=require";

const ADMIN_NAME     = "Nippy Sky";
const ADMIN_EMAIL    = "contact@nippysky.com";
const ADMIN_PASSWORD = "DevAdmin2024";   // bcrypt — NestJS re-hashes to argon2 on first login

const { Pool } = pg;
const pool = new Pool({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } });

function cuid() {
  return "c" + Math.random().toString(36).slice(2, 12) + Date.now().toString(36);
}

function daysFromNow(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString();
}

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

async function run() {
  const client = await pool.connect();
  try {
    console.log("🗑  Wiping all tables…");
    await client.query(`
      TRUNCATE TABLE
        audit_logs,
        evidence,
        findings,
        reviews,
        assets,
        workspace_settings,
        workspace_members,
        workspaces,
        users
      RESTART IDENTITY CASCADE;
    `);
    console.log("✅  All tables cleared.\n");

    // ── Admin user ────────────────────────────────────────────────────────────
    const passwordHash = await bcryptjs.hash(ADMIN_PASSWORD, 12);
    const userId = cuid();
    await client.query(
      `INSERT INTO users (id, name, email, "passwordHash", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, NOW(), NOW())`,
      [userId, ADMIN_NAME, ADMIN_EMAIL, passwordHash]
    );
    console.log(`👤  Admin: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);

    // ── Workspace ─────────────────────────────────────────────────────────────
    const workspaceId = cuid();
    await client.query(
      `INSERT INTO workspaces (id, name, slug, industry, timezone, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
      [workspaceId, "BYUND Dev", "byund-dev", "Technology", "UTC"]
    );

    await client.query(
      `INSERT INTO workspace_members (id, "workspaceId", "userId", role, "createdAt")
       VALUES ($1, $2, $3, 'OWNER', NOW())`,
      [cuid(), workspaceId, userId]
    );

    await client.query(
      `INSERT INTO workspace_settings (id, "workspaceId", "updatedAt")
       VALUES ($1, $2, NOW())`,
      [cuid(), workspaceId]
    );
    console.log(`🏢  Workspace: BYUND Dev (slug: byund-dev)\n`);

    // ── Assets ────────────────────────────────────────────────────────────────
    const assets = [
      { name: "Production API Server",  type: "SERVER",   criticality: "CRITICAL", env: "production", cycle: 30  },
      { name: "Governance Database",    type: "DATABASE", criticality: "CRITICAL", env: "production", cycle: 30  },
      { name: "SSL Certificate (byund.com)", type: "SSL_CERT", criticality: "HIGH", env: "production", cycle: 60 },
      { name: "Railway Deployment",     type: "CLOUD",    criticality: "HIGH",     env: "production", cycle: 90  },
      { name: "NestJS Auth API Key",    type: "API_KEY",  criticality: "MEDIUM",   env: "production", cycle: 90  },
    ];

    const assetIds = [];
    for (const a of assets) {
      const id = cuid();
      assetIds.push(id);
      const nextReview = daysFromNow(a.cycle);
      const lastReview = daysAgo(5);
      await client.query(
        `INSERT INTO assets (id, "workspaceId", name, type, criticality, environment, "reviewCycleDays",
           "lastReviewedAt", "nextReviewDue", "createdAt", "updatedAt")
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,NOW(),NOW())`,
        [id, workspaceId, a.name, a.type, a.criticality, a.env, a.cycle, lastReview, nextReview]
      );
    }
    console.log(`🖥  ${assets.length} assets created.`);

    // ── Reviews ───────────────────────────────────────────────────────────────
    const reviews = [
      { assetIdx: 0, status: "DUE",      scheduledOffset: -2, dueOffset: 0  },
      { assetIdx: 1, status: "UPCOMING", scheduledOffset: 5,  dueOffset: 30 },
      { assetIdx: 2, status: "OVERDUE",  scheduledOffset: -15, dueOffset: -7 },
    ];

    const reviewIds = [];
    for (const r of reviews) {
      const id = cuid();
      reviewIds.push(id);
      await client.query(
        `INSERT INTO reviews (id, "workspaceId", "assetId", "assigneeId", "scheduledAt", "dueAt",
           status, "createdAt", "updatedAt")
         VALUES ($1,$2,$3,$4,$5,$6,$7,NOW(),NOW())`,
        [id, workspaceId, assetIds[r.assetIdx], userId,
         daysFromNow(r.scheduledOffset), daysFromNow(r.dueOffset), r.status]
      );
    }
    console.log(`📋  ${reviews.length} reviews created.`);

    // ── Findings ──────────────────────────────────────────────────────────────
    const findings = [
      { assetIdx: 0, title: "TLS 1.1 still enabled on API server",  severity: "HIGH",   status: "OPEN"        },
      { assetIdx: 1, title: "Database backups not encrypted at rest", severity: "CRITICAL", status: "IN_PROGRESS" },
      { assetIdx: 4, title: "API key rotation overdue (180+ days)",   severity: "MEDIUM", status: "OPEN"        },
    ];

    for (const f of findings) {
      await client.query(
        `INSERT INTO findings (id, "workspaceId", "assetId", "assigneeId", title, severity, status,
           "createdAt", "updatedAt")
         VALUES ($1,$2,$3,$4,$5,$6,$7,NOW(),NOW())`,
        [cuid(), workspaceId, assetIds[f.assetIdx], userId, f.title, f.severity, f.status]
      );
    }
    console.log(`🔍  ${findings.length} findings created.`);

    // ── Audit Log ─────────────────────────────────────────────────────────────
    const logs = [
      { action: "WORKSPACE_CREATED",  targetType: "Workspace", targetLabel: "BYUND Dev"                },
      { action: "ASSET_CREATED",      targetType: "Asset",     targetLabel: "Production API Server"    },
      { action: "ASSET_CREATED",      targetType: "Asset",     targetLabel: "Governance Database"      },
      { action: "FINDING_CREATED",    targetType: "Finding",   targetLabel: "TLS 1.1 still enabled…"  },
      { action: "REVIEW_SCHEDULED",   targetType: "Review",    targetLabel: "Production API Server"    },
    ];

    for (const l of logs) {
      await client.query(
        `INSERT INTO audit_logs (id, "workspaceId", "actorId", action, "targetType", "targetLabel", "createdAt")
         VALUES ($1,$2,$3,$4,$5,$6,NOW())`,
        [cuid(), workspaceId, userId, l.action, l.targetType, l.targetLabel]
      );
    }
    console.log(`📜  ${logs.length} audit log entries created.\n`);

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("✅  Database reset complete!");
    console.log("");
    console.log("  Login at:  https://byund-accounts.vercel.app");
    console.log("  Email:     contact@nippysky.com");
    console.log("  Password:  DevAdmin2024");
    console.log("");
    console.log("  Note: NestJS re-hashes to argon2 on first successful login.");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  } finally {
    client.release();
    await pool.end();
  }
}

run().catch((e) => {
  console.error("❌ Seed failed:", e.message);
  process.exit(1);
});
