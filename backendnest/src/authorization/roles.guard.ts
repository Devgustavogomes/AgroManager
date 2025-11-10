import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/decorators/roles.decorator';
import { AuthenticatedRequest } from 'src/types/authenticatedRequest';
import { Role } from 'src/types/role';

@Injectable()
export class RolesGuards implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { producer } = context
      .switchToHttp()
      .getRequest<AuthenticatedRequest>();

    return requiredRoles.includes(producer.role);
  }
}
