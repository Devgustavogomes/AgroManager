import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthenticatedRequest } from 'src/shared/types/authenticatedRequest';
import { JwtPayload } from '../types/jwtPayload';
import { UnauthorizedError } from '../domain/errors/unauthorizedError';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: AuthenticatedRequest = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedError('Token not found');
    }
    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(token);

      request.producer = {
        id: payload.id,
        username: payload.username,
        role: payload.role,
      };
    } catch {
      throw new UnauthorizedError('Invalid token');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
