import { Injectable } from '@nestjs/common';
import { Notification } from 'src/shared/domain/entities/notification.entity';

export interface NotificationPersistence {
  notificationId: string;
  producerId: string;
  event: string;
  title: string;
  content: string;
  link: string | null;
  read: boolean;
  createdAt: Date;
  updatedAt: Date | null;
}

@Injectable()
export abstract class NotificationProviderContract {
  abstract setServer(server: unknown): void;

  abstract sendToProducer(producerId: string, notification: Notification): void;

  abstract sendToAll(notification: Notification): void;
}
