import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";
import { AuthModule } from "./modules/auth/auth.module";
import { WorkspacesModule } from "./modules/workspaces/workspaces.module";
import { AssetsModule } from "./modules/assets/assets.module";
import { ReviewsModule } from "./modules/reviews/reviews.module";
import { FindingsModule } from "./modules/findings/findings.module";

@Module({
  imports: [
    // ── Config (reads .env) ──
    ConfigModule.forRoot({ isGlobal: true, cache: true }),

    // ── Rate limiting: 100 req / 60s per IP ──
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }]),

    // ── Domain modules ──
    AuthModule,
    WorkspacesModule,
    AssetsModule,
    ReviewsModule,
    FindingsModule,
  ],
})
export class AppModule {}
