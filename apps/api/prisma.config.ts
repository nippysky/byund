import path from "node:path";
import { defineConfig } from "prisma/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { config as dotenvConfig } from "dotenv";

// Prisma CLI doesn't load .env automatically — load it manually
dotenvConfig({ path: path.resolve(__dirname, ".env") });
dotenvConfig({ path: path.resolve(__dirname, ".env.local"), override: false });

export default defineConfig({
  // @ts-expect-error earlyAccess is a Prisma CLI flag not yet in the TS types
  earlyAccess: true,
  schema: path.join("prisma", "schema.prisma"),
  datasource: {
    // Falls back to empty string during `prisma generate` (no DB connection needed there)
    url: process.env.DATABASE_URL ?? "",
  },
  migrate: {
    async adapter(env: { DATABASE_URL: string }) {
      const pool = new Pool({
        connectionString: env.DATABASE_URL,
        ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
      });
      return new PrismaPg(pool);
    },
  },
});
