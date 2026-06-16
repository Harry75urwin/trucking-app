import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac } from 'crypto';

function base64UrlDecode(value: string): string {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padding = normalized.length % 4;
  const withPadding = normalized + '='.repeat(padding === 0 ? 0 : 4 - padding);
  return Buffer.from(withPadding, 'base64').toString('utf-8');
}

function parseJwt(token: string): Record<string, unknown> | null {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  try {
    return JSON.parse(base64UrlDecode(parts[1])) as Record<string, unknown>;
  } catch {
    return null;
  }
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authorization =
      request.headers?.authorization ?? request.headers?.Authorization;
    if (!authorization || typeof authorization !== 'string') {
      throw new UnauthorizedException('Missing authorization header');
    }

    const match = authorization.match(/Bearer\s+(.+)/i);
    if (!match) {
      throw new UnauthorizedException('Invalid authorization header');
    }

    const token = match[1];
    const secret =
      this.configService.get<string>('AUTH_SECRET') ?? 'development-secret';
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new UnauthorizedException('Invalid token format');
    }

    const signature = createHmac('sha256', secret)
      .update(`${parts[0]}.${parts[1]}`)
      .digest('base64url');
    if (signature !== parts[2]) {
      throw new UnauthorizedException('Invalid token signature');
    }

    const payload = parseJwt(token);
    if (!payload) {
      throw new UnauthorizedException('Invalid token payload');
    }

    const exp = typeof payload.exp === 'number' ? payload.exp : null;
    if (exp && Math.floor(Date.now() / 1000) > exp) {
      throw new UnauthorizedException('Token expired');
    }

    request.user = {
      userId:
        typeof payload.sub === 'number' ? payload.sub : Number(payload.sub),
      email: typeof payload.email === 'string' ? payload.email : undefined,
      role: typeof payload.role === 'string' ? payload.role : undefined,
      organizationId:
        typeof payload.organizationId === 'number'
          ? payload.organizationId
          : undefined,
    };

    return true;
  }
}
