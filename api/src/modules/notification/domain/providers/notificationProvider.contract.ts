import { Injectable } from '@nestjs/common';
import { Notification } from 'src/shared/domain/entities/notification.entity';

@Injectable()
export abstract class NotificationProviderContract {
  abstract setServer(server: unknown): void;

  abstract sendToProducer(producerId: string, notification: Notification): void;

  abstract sendToAll(notification: Notification): void;
}
