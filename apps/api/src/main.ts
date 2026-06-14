import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { ValidationPipe, Logger } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const logger = new Logger("BYUND API");

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: false }),
  );

  // ── Global prefix ──
  app.setGlobalPrefix("v1");

  // ── CORS ──
  app.enableCors({
    origin: [
      process.env.NEXT_PUBLIC_GOVERNANCE_URL ?? "http://localhost:3001",
      process.env.NEXT_PUBLIC_WEB_URL ?? "http://localhost:3000",
      process.env.NEXT_PUBLIC_ACCOUNTS_URL ?? "http://localhost:3002",
    ],
    credentials: true,
  });

  // ── Validation ──
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,        // strip unknown fields
    forbidNonWhitelisted: true,
    transform: true,        // auto-transform payloads to DTO classes
    transformOptions: { enableImplicitConversion: true },
  }));

  // ── Swagger (dev only) ──
  if (process.env.NODE_ENV !== "production") {
    const config = new DocumentBuilder()
      .setTitle("BYUND API")
      .setDescription("IT Governance platform REST API — NIPPYSKY LIMITED")
      .setVersion("1.0")
      .addBearerAuth()
      .build();
    const doc = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("docs", app, doc);
    logger.log("Swagger docs: http://localhost:4000/docs");
  }

  const port = process.env.PORT ?? 4000;
  await app.listen(port, "0.0.0.0");
  logger.log(`BYUND API running on http://localhost:${port}/v1`);
}

bootstrap();
