import path from "node:path";
import { defineConfig } from "prisma/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { config as dotenvConfig } from "dotenv";

// Prisma CLI doesn't load .env.local — load it manually so DATABASE_URL is available
dotenvConfig({ path: ".env.local" });

export default defineConfig({
  // @ts-expect-error earlyAccess is a Prisma CLI flag not yet in the TS types
  earlyAccess: true,
  schema: path.join("prisma", "schema.prisma"),
  datasource: {
    url: process.env.DATABASE_URL!,
  },
  migrate: {
    async adapter(env: { DATABASE_URL: string }) {
      const pool = new Pool({
        connectionString: env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
      });
      return new PrismaPg(pool);
    },
  },
});
