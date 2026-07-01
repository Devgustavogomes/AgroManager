import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Type,
} from '@nestjs/common';
import { ModuleRef, Reflector } from '@nestjs/core';
import { OWNER_SERVICE_KEY } from 'src/shared/decorators/owner.decorator';
import { AuthenticatedRequest } from 'src/shared/types/authenticatedRequest';
import { Role } from 'src/shared/types/role';
import { UnauthorizedError } from '../domain/errors/unauthorizedError';

interface Service {
  execute(idProducer: string, idService: string): Promise<boolean>;
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
      throw new UnauthorizedError();
    }

    if (producer.role === Role.ADMIN) {
      return true;
    }

    const serviceToken = this.reflector.getAllAndOverride<{
      service: Type<Service>;
      paramsKey?: string;
    }>(OWNER_SERVICE_KEY, [context.getHandler(), context.getClass()]);

    if (!serviceToken) {
      return true;
    }

    const service: Service = await this.moduleRef.get(serviceToken.service, {
      strict: false,
    });

    const resourceId = (
      serviceToken.paramsKey
        ? request.params[serviceToken.paramsKey]
        : request.params.id
    ) as string;

    const isOwner = await service.execute(producer.id, resourceId);

    if (!isOwner) {
      throw new ForbiddenException('You do not own this resource.');
    }

    return true;
  }
}
