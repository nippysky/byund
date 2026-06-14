import path from "node:path";
import { defineConfig } from "prisma/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { config as dotenvConfig } from "dotenv";

// Load .env so DATABASE_URL is available to Prisma CLI
dotenvConfig({ path: ".env" });

export default defineConfig({
  // @ts-expect-error earlyAccess not in Prisma 7 types but still accepted by CLI
  earlyAccess: true,
  schema: path.join("prisma", "schema.prisma"),
  datasource: {
    url: process.env.DATABASE_URL!,
  },
  migrate: {
    async adapter(env) {
      const pool = new Pool({
        connectionString: env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
      });
      return new PrismaPg(pool);
    },
  },
});
