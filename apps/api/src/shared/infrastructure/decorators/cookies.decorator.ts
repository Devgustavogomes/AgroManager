import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

export const Cookies = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();

    const cookies = request.cookies as Record<string, string>;

    return data ? cookies[data] : cookies;
  },
);
