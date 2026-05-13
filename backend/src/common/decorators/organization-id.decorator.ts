import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

export const OrganizationId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const req = ctx.switchToHttp().getRequest<Request>();
    const headerName = 'x-organization-id';
    const valueRaw = req.headers[headerName] ?? req.headers[headerName as keyof typeof req.headers];
    const value = typeof valueRaw === 'string' ? valueRaw : Array.isArray(valueRaw) ? valueRaw[0] : undefined;
    if (!value || value.trim() === '') {
      throw new BadRequestException('Missing x-organization-id header');
    }
    return value.trim();
  },
);
