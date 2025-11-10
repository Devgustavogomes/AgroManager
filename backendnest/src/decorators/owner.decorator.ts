import { SetMetadata } from '@nestjs/common';

export const OWNER_SERVICE_KEY = 'ownerService';
export const OwnerService = (service: any) =>
  SetMetadata(OWNER_SERVICE_KEY, service);
