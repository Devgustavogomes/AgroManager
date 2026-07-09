import { Notification } from 'src/shared/domain/entities/notification.entity';
import { NotificationPersistence } from '../domain/providers/notificationProvider.contract';

export class NotificationMapper {
  static toDomain(data: NotificationPersistence[]): Notification[] {
    return data.map((r) =>
      Notification.create({
        notificationId: r.notificationId,
        event: r.event,
        title: r.title,
        content: r.content,
        link: r.link ?? undefined,
        read: r.read,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      }),
    );
  }

  static toResponse(notification: Notification) {
    return {
      notificationId: notification.notificationId,
      event: notification.event,
      title: notification.title,
      content: notification.content,
      read: notification.read,
      createdAt: notification.createdAt.toISOString(),
      updatedAt: notification.updatedAt
        ? notification.updatedAt.toISOString()
        : null,
    };
  }
}
