import { PrismaClient } from "./generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

declare global {
  var prisma: PrismaClient | undefined;
}

function makeClient() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!, // pooler for runtime
  });
  return new PrismaClient({ adapter });
}

export const prisma = global.prisma ?? makeClient();
if (process.env.NODE_ENV !== "production") global.prisma = prisma;
