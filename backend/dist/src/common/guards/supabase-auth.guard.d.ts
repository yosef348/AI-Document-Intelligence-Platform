import { CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Config } from '../../config/configuration';
export declare class SupabaseAuthGuard implements CanActivate {
    private readonly config;
    private readonly supabase;
    constructor(config: ConfigService<Config, true>);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private extractBearerToken;
}
