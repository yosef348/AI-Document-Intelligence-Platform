import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import type { User } from '@supabase/supabase-js';

export const CurrentUser = createParamDecorator((_: unknown, ctx: ExecutionContext): User => {
  const req = ctx.switchToHttp().getRequest<Request>();
  const user = (req as unknown as { user?: User }).user;
  if (!user) {
    throw new UnauthorizedException();
  }
  return user;
});
