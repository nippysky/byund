import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import type { FastifyRequest } from "fastify";
import type { SessionPayload } from "../auth.service";

/**
 * JwtStrategy — validates JWT from EITHER:
 *   1. Authorization: Bearer <token>  (API clients)
 *   2. byund_session httpOnly cookie  (browser SSO across all *.byund.com apps)
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(cfg: ConfigService) {
    super({
      // Try cookie first, fall back to Bearer header
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: FastifyRequest) => {
          const cookies = (req as FastifyRequest & { cookies?: Record<string, string> }).cookies;
          return cookies?.["byund_session"] ?? null;
        },
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey:    cfg.getOrThrow<string>("JWT_SECRET"),
      ignoreExpiration: false,
      passReqToCallback: false,
    });
  }

  async validate(payload: SessionPayload) {
    if (!payload?.sub) throw new UnauthorizedException("Invalid token");
    return {
      sub:         payload.sub,
      email:       payload.email,
      name:        payload.name,
      workspaceId: payload.workspaceId,
      role:        payload.role,
    };
  }
}
