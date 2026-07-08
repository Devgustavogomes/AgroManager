import { Module } from '@nestjs/common';
import { NotificationGateway } from '../presentation/notification.gateway';
import { NotificationProviderContract } from '../domain/providers/notificationProvider.contract';
import { NotificationProvider } from './providers/socketNotification.provider';
import { ProducerCreatedListener } from '../application/listeners/producerCreated.listener';
import { ProducerUpdatedListener } from '../application/listeners/producerUpdated.listener';

@Module({
  providers: [
    NotificationGateway,
    { provide: NotificationProviderContract, useClass: NotificationProvider },
    ProducerCreatedListener,
    ProducerUpdatedListener,
  ],
  exports: [NotificationProviderContract],
})
export class NotificationModule {}
