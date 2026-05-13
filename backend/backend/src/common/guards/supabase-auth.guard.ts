import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js';
import type { Request } from 'express';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  private readonly supabase: SupabaseClient;

  constructor() {
    const url = process.env.SUPABASE_URL ?? '';
    const anonKey = process.env.SUPABASE_ANON_KEY ?? '';
    this.supabase = createClient(url, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const authHeader = req.headers['authorization'];
    const token = this.extractBearerToken(typeof authHeader === 'string' ? authHeader : Array.isArray(authHeader) ? authHeader[0] : undefined);

    if (!token) {
      throw new UnauthorizedException('Missing Bearer token');
    }

    const { data, error } = await this.supabase.auth.getUser(token);
    if (error || !data?.user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    (req as unknown as { user?: User }).user = data.user;
    return true;
  }

  private extractBearerToken(header: string | undefined): string | undefined {
    if (!header) return undefined;
    const [scheme, value] = header.split(' ');
    if (!scheme || scheme.toLowerCase() !== 'bearer' || !value) return undefined;
    return value.trim();
  }
}
