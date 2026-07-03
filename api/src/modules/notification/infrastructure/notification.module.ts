import { Global, Module } from '@nestjs/common';
import { NotificationGateway } from '../presentation/notification.gateway';
import { NotificationProviderContract } from '../domain/providers/notificationProvider.contract';
import { NotificationProvider } from './providers/socketNotification.provider';

@Global()
@Module({
  providers: [
    NotificationGateway,
    { provide: NotificationProviderContract, useClass: NotificationProvider },
  ],
  exports: [NotificationProviderContract],
})
export class NotificationModule {}
