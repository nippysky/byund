import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

/**
 * PrismaService — connects to the shared BYUND PostgreSQL database.
 * Shared across all NestJS modules as a singleton.
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: process.env.NODE_ENV === "development"
        ? [{ level: "query", emit: "stdout" }, { level: "warn", emit: "stdout" }]
        : [{ level: "warn", emit: "stdout" }, { level: "error", emit: "stdout" }],
    });
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log("Connected to BYUND database");
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
