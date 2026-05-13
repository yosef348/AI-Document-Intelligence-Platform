import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js';
import type { Request } from 'express';
import type { Config } from '../../config/configuration';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  private readonly supabase: SupabaseClient;

  constructor(private readonly config: ConfigService<Config, true>) {
    const url = this.config.get('supabase.url', { infer: true });
    const anonKey = this.config.get('supabase.anonKey', { infer: true });
    if (!url || !anonKey) {
      throw new Error('Supabase configuration is missing: SUPABASE_URL and/or SUPABASE_ANON_KEY');
    }
    this.supabase = createClient(url, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const authHeader =
      req.headers['authorization'] ?? req.headers['Authorization' as keyof typeof req.headers];
    const token = this.extractBearerToken(typeof authHeader === 'string' ? authHeader : Array.isArray(authHeader) ? authHeader[0] : undefined);

    if (!token) {
      throw new UnauthorizedException('Missing Bearer token');
    }

    try {
      const { data, error } = await this.supabase.auth.getUser(token);
      if (error || !data?.user) {
        throw new UnauthorizedException('Invalid or expired token');
      }

      // Attach authenticated user to request
      (req as unknown as { user?: User }).user = data.user;
    } catch (e) {
      if (e instanceof UnauthorizedException) {
        throw e;
      }
      // Treat unexpected/auth service failures as 503
      throw new ServiceUnavailableException('Authentication service unavailable');
    }
    return true;
  }

  private extractBearerToken(header: string | undefined): string | undefined {
    if (!header) return undefined;
    const [scheme, value] = header.split(' ');
    if (!scheme || scheme.toLowerCase() !== 'bearer' || !value) return undefined;
    return value.trim();
  }
}
