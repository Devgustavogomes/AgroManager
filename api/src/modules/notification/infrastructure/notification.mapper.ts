import { Notification } from 'src/shared/domain/entities/notification.entity';
export class NotificationMapper {
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
