import { Controller, Get, UseGuards } from '@nestjs/common';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { User } from '@supabase/supabase-js';
import { AuthService } from './auth.service';

@Controller('auth')
@UseGuards(SupabaseAuthGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('me')
  async me(
    @CurrentUser() user: User,
  ): Promise<{ user: User; profile: unknown }> {
    const profile = await this.authService.getProfile(user.id);
    return { user, profile };
  }
}
