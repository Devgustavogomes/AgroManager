import { SetMetadata } from '@nestjs/common';

export const OWNER_SERVICE_KEY = 'ownerService';
export const OwnerService = (service: object) =>
  SetMetadata(OWNER_SERVICE_KEY, service);
