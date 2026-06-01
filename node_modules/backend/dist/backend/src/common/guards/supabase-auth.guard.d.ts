import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class SupabaseAuthGuard implements CanActivate {
    private readonly supabase;
    constructor();
    canActivate(context: ExecutionContext): Promise<boolean>;
    private extractBearerToken;
}
