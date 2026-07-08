import { Module } from '@nestjs/common';
import { NotificationGateway } from '../presentation/notification.gateway';
import { NotificationProviderContract } from '../domain/providers/notificationProvider.contract';
import { NotificationProvider } from './providers/socketNotification.provider';
import { ProducerCreatedListener } from '../application/listeners/producerCreated.listener';
import { ProducerUpdatedListener } from '../application/listeners/producerUpdated.listener';
import { PropertyCreatedListener } from '../application/listeners/propertyCreated.listener';
import { PropertyUpdatedListener } from '../application/listeners/propertyUpdated.listener';
import { CultureCreatedListener } from '../application/listeners/cultureCreated.listener';
import { CultureUpdatedListener } from '../application/listeners/cultureUpdated.listener';

@Module({
  providers: [
    NotificationGateway,
    { provide: NotificationProviderContract, useClass: NotificationProvider },
    ProducerCreatedListener,
    ProducerUpdatedListener,
    PropertyCreatedListener,
    PropertyUpdatedListener,
    CultureCreatedListener,
    CultureUpdatedListener,
  ],
  exports: [NotificationProviderContract],
})
export class NotificationModule {}
