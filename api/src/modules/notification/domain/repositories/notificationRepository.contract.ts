import { Notification } from 'src/modules/notification/domain/entities/notification.entity';

export abstract class NotificationContract {
  abstract create(
    producerId: string,
    notification: Notification,
  ): Promise<Notification>;
  abstract markAsRead(notificationId: string): Promise<void>;
  abstract findAll(producerId: string): Promise<Notification[]>;
  abstract delete(notificationId: string): Promise<void>;
}
