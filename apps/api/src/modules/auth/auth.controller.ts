import {
  Body, Controller, Post, Get, Patch, HttpCode, HttpStatus,
  Res, UseGuards, Req, HttpException,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth, ApiCookieAuth } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import type { FastifyReply, FastifyRequest } from "fastify";
import { AuthService, type SessionPayload } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { RefreshDto } from "./dto/refresh.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { UpdatePreferencesDto, UpdateAvatarDto } from "./dto/update-preferences.dto";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  // ─────────────────────────────────────────────
  // POST /v1/auth/register
  // ─────────────────────────────────────────────
  @Post("register")
  @ApiOperation({ summary: "Create a new BYUND account + workspace" })
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const result = await this.auth.register(dto);
    res.setCookie(this.auth.COOKIE_NAME, result.token, this.auth.cookieOptions());
    return result;
  }

  // ─────────────────────────────────────────────
  // POST /v1/auth/login
  // ─────────────────────────────────────────────
  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Sign in — sets byund_session cookie + returns token" })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const result = await this.auth.login(dto);
    res.setCookie(this.auth.COOKIE_NAME, result.token, this.auth.cookieOptions());
    return result;
  }

  // ─────────────────────────────────────────────
  // GET /v1/auth/me
  // ─────────────────────────────────────────────
  @Get("me")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiCookieAuth("byund_session")
  @ApiOperation({ summary: "Get current user profile and workspace" })
  async me(@Req() req: FastifyRequest & { user: SessionPayload }) {
    return this.auth.me(req.user.sub, req.user.workspaceId);
  }

  // ─────────────────────────────────────────────
  // POST /v1/auth/refresh
  // ─────────────────────────────────────────────
  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Refresh session token" })
  async refresh(
    @Body() dto: RefreshDto,
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    // Accept token from body OR from cookie
    const token = dto.refreshToken ?? (req.cookies?.[this.auth.COOKIE_NAME] ?? "");
    if (!token) throw new HttpException("No token provided", HttpStatus.BAD_REQUEST);

    const result = await this.auth.refresh(token);
    res.setCookie(this.auth.COOKIE_NAME, result.token, this.auth.cookieOptions());
    return result;
  }

  // ─────────────────────────────────────────────
  // POST /v1/auth/change-password
  // ─────────────────────────────────────────────
  @Post("change-password")
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiCookieAuth("byund_session")
  @ApiOperation({ summary: "Change the authenticated user's password" })
  async changePassword(
    @Body() dto: ChangePasswordDto,
    @Req() req: FastifyRequest & { user: SessionPayload },
  ) {
    return this.auth.changePassword(req.user.sub, dto.currentPassword, dto.newPassword);
  }

  // ─────────────────────────────────────────────
  // PATCH /v1/auth/preferences
  // ─────────────────────────────────────────────
  @Patch("preferences")
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update user preferences (theme etc.)" })
  async updatePreferences(
    @Body() dto: UpdatePreferencesDto,
    @Req() req: FastifyRequest & { user: SessionPayload },
  ) {
    return this.auth.updatePreferences(req.user.sub, dto);
  }

  // ─────────────────────────────────────────────
  // PATCH /v1/auth/avatar
  // ─────────────────────────────────────────────
  @Patch("avatar")
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update user avatar URL" })
  async updateAvatar(
    @Body() dto: UpdateAvatarDto,
    @Req() req: FastifyRequest & { user: SessionPayload },
  ) {
    return this.auth.updateAvatar(req.user.sub, dto.avatarUrl);
  }

  // ─────────────────────────────────────────────
  // GET /v1/auth/subscription
  // ─────────────────────────────────────────────
  @Get("subscription")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get current user subscription" })
  async getSubscription(@Req() req: FastifyRequest & { user: SessionPayload }) {
    return this.auth.getSubscription(req.user.sub);
  }

  // ─────────────────────────────────────────────
  // POST /v1/auth/logout
  // ─────────────────────────────────────────────
  @Post("logout")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Sign out — clears byund_session cookie" })
  async logout(@Res({ passthrough: true }) res: FastifyReply) {
    res.setCookie(this.auth.COOKIE_NAME, "", this.auth.cookieOptions(true));
    return { ok: true, message: "Signed out successfully" };
  }
}
