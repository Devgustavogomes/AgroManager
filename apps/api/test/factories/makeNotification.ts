import { randomUUID } from 'crypto';
import {
  Notification,
  NotificationProps,
} from '../../src/modules/notification/domain/entities/notification.entity';

type Override = Partial<NotificationProps>;

export function makeFakeNotification(override: Override = {}) {
  return Notification.create({
    notificationId: randomUUID(),
    event: 'test.event',
    title: 'Test Title',
    content: 'Test content of the notification',
    read: false,
    ...override,
  });
}
