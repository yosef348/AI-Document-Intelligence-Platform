import type { User } from '@supabase/supabase-js';
import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    me(user: User): Promise<{
        user: User;
        profile: unknown;
    }>;
}
