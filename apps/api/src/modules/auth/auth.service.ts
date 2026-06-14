import {
  Injectable, UnauthorizedException, ConflictException, NotFoundException,
  Logger,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as argon2 from "argon2";
import { PrismaService } from "../../common/prisma.service";
import type { RegisterDto } from "./dto/register.dto";
import type { LoginDto } from "./dto/login.dto";

export interface SessionPayload {
  sub:         string;   // userId
  email:       string;
  name:        string;
  workspaceId: string;
  role:        string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  /** Name of the SSO cookie shared across all *.byund.com apps */
  readonly COOKIE_NAME = "byund_session";

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt:    JwtService,
    private readonly cfg:    ConfigService,
  ) {}

  // ────────────────────────────────────────────────────────────────
  // REGISTER
  // ────────────────────────────────────────────────────────────────
  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException("Email already registered");

    const passwordHash = await argon2.hash(dto.password, {
      type:         argon2.argon2id,
      memoryCost:   65_536,
      timeCost:     3,
      parallelism:  1,
    });

    const workspaceName = dto.workspaceName ?? `${dto.name}'s Workspace`;
    const slug = workspaceName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .slice(0, 40) + "-" + Date.now().toString(36);

    const { user, workspace, role } = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: { name: dto.name, email: dto.email, passwordHash },
      });
      const workspace = await tx.workspace.create({
        data: {
          name:     workspaceName,
          slug,
          members:  { create: { userId: user.id, role: "OWNER" } },
          settings: { create: {} },
        },
      });
      await tx.auditLog.create({
        data: {
          workspaceId:  workspace.id,
          actorId:      user.id,
          action:       "WORKSPACE_CREATED",
          targetType:   "Workspace",
          targetId:     workspace.id,
          targetLabel:  workspace.name,
        },
      });
      return { user, workspace, role: "OWNER" as const };
    });

    this.logger.log(`New account: ${user.email} → workspace ${workspace.slug}`);

    const token = this.sign({ sub: user.id, email: user.email, name: user.name, workspaceId: workspace.id, role });

    return {
      token,
      user:      { id: user.id, name: user.name, email: user.email, avatarUrl: user.avatarUrl },
      workspace: { id: workspace.id, name: workspace.name, slug: workspace.slug },
      role,
    };
  }

  // ────────────────────────────────────────────────────────────────
  // LOGIN
  // ────────────────────────────────────────────────────────────────
  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException("Invalid email or password");

    const valid = await argon2.verify(user.passwordHash, dto.password);
    if (!valid) throw new UnauthorizedException("Invalid email or password");

    // Return the user's primary workspace (their OWNER workspace, or first joined)
    const member = await this.prisma.workspaceMember.findFirst({
      where:   { userId: user.id },
      include: { workspace: true },
      orderBy: [{ role: "asc" }, { createdAt: "asc" }],  // ADMIN < OWNER lexically, so sort by createdAt wins for OWNER
    });

    if (!member) throw new NotFoundException("No workspace found for this account");

    const token = this.sign({
      sub:         user.id,
      email:       user.email,
      name:        user.name,
      workspaceId: member.workspaceId,
      role:        member.role,
    });

    return {
      token,
      user:      { id: user.id, name: user.name, email: user.email, avatarUrl: user.avatarUrl },
      workspace: { id: member.workspaceId, name: member.workspace.name, slug: member.workspace.slug },
      role:      member.role,
    };
  }

  // ────────────────────────────────────────────────────────────────
  // ME — decode token + enrich from DB
  // ────────────────────────────────────────────────────────────────
  async me(userId: string, workspaceId: string) {
    const [user, member] = await Promise.all([
      this.prisma.user.findUnique({
        where:  { id: userId },
        select: { id: true, name: true, email: true, avatarUrl: true, createdAt: true },
      }),
      this.prisma.workspaceMember.findFirst({
        where:   { userId, workspaceId },
        include: { workspace: { include: { settings: true } } },
      }),
    ]);

    if (!user)   throw new UnauthorizedException("User not found");
    if (!member) throw new UnauthorizedException("Not a member of this workspace");

    return {
      user,
      workspace: {
        id:       member.workspaceId,
        name:     member.workspace.name,
        slug:     member.workspace.slug,
        logoUrl:  member.workspace.logoUrl,
        settings: member.workspace.settings,
      },
      role: member.role,
    };
  }

  // ────────────────────────────────────────────────────────────────
  // REFRESH
  // ────────────────────────────────────────────────────────────────
  async refresh(rawToken: string) {
    let payload: SessionPayload;
    try {
      payload = this.jwt.verify<SessionPayload>(rawToken);
    } catch {
      throw new UnauthorizedException("Invalid or expired token");
    }

    // Re-check user still exists
    const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) throw new UnauthorizedException("User no longer exists");

    const token = this.sign({
      sub:         payload.sub,
      email:       payload.email,
      name:        payload.name,
      workspaceId: payload.workspaceId,
      role:        payload.role,
    });

    return { token };
  }

  // ────────────────────────────────────────────────────────────────
  // COOKIE OPTIONS (shared with controller)
  // ────────────────────────────────────────────────────────────────
  cookieOptions(clear = false) {
    const isProd = this.cfg.get("NODE_ENV") === "production";
    return {
      httpOnly:  true,
      secure:    isProd,
      sameSite:  isProd ? ("none" as const) : ("lax" as const),
      domain:    isProd ? ".byund.com" : undefined,
      path:      "/",
      maxAge:    clear ? 0 : 7 * 24 * 60 * 60 * 1000,   // 7 days in ms (Fastify uses ms)
    };
  }

  // ────────────────────────────────────────────────────────────────
  // PRIVATE HELPERS
  // ────────────────────────────────────────────────────────────────
  private sign(payload: SessionPayload) {
    return this.jwt.sign(payload);
  }
}
