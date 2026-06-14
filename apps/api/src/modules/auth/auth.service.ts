import { Injectable, UnauthorizedException, ConflictException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as argon2 from "argon2";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";

// TODO: Inject PrismaService from @byund/database once the package is wired
// For now this is the service shell — replace DB calls with Prisma

@Injectable()
export class AuthService {
  constructor(private readonly jwt: JwtService) {}

  async register(dto: RegisterDto) {
    // 1. Check email not taken
    // const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    // if (existing) throw new ConflictException("Email already registered");

    // 2. Hash password
    const hash = await argon2.hash(dto.password, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 1,
    });

    // 3. Create user + workspace in transaction
    // const { user, workspace } = await this.prisma.$transaction(async (tx) => { ... })

    // 4. Issue tokens
    const payload = { sub: "user-id-placeholder", email: dto.email };
    return {
      accessToken: this.jwt.sign(payload),
      user: { id: "placeholder", name: dto.name, email: dto.email },
    };
  }

  async login(dto: LoginDto) {
    // 1. Find user
    // const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    // if (!user) throw new UnauthorizedException("Invalid credentials");

    // 2. Verify password
    // const valid = await argon2.verify(user.passwordHash, dto.password);
    // if (!valid) throw new UnauthorizedException("Invalid credentials");

    const payload = { sub: "user-id-placeholder", email: dto.email };
    return {
      accessToken: this.jwt.sign(payload),
      user: { id: "placeholder", email: dto.email },
    };
  }

  async refresh(token: string) {
    try {
      const payload = this.jwt.verify(token);
      return { accessToken: this.jwt.sign({ sub: payload.sub, email: payload.email }) };
    } catch {
      throw new UnauthorizedException("Invalid or expired refresh token");
    }
  }
}
