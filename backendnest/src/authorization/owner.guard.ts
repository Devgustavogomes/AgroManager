import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ModuleRef, Reflector } from '@nestjs/core';
import { OWNER_SERVICE_KEY } from 'src/decorators/owner.decorator';
import { AuthenticatedRequest } from 'src/types/authenticatedRequest';
import { Role } from 'src/types/role';

interface Service {
  findOwner(id: string): Promise<{ id_owner: string } | undefined>;
}

@Injectable()
export class OwnerGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly moduleRef: ModuleRef,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const producer = request.producer;

    if (!producer) {
      throw new UnauthorizedException();
    }

    if (producer.role === Role.ADMIN) {
      return true;
    }

    const serviceToken = this.reflector.getAllAndOverride(OWNER_SERVICE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!serviceToken) {
      return true;
    }

    const service: Service = await this.moduleRef.get(serviceToken, {
      strict: false,
    });

    const owner = await service.findOwner(producer.id);

    if (!owner || producer.id !== owner.id_owner) {
      throw new ForbiddenException('You do not own this resource.');
    }

    return true;
  }
}
