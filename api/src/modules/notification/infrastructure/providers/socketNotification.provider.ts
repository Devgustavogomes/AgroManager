import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { Notification } from 'src/shared/domain/entities/notification.entity';

import { NotificationProviderContract } from '../../domain/providers/notificationProvider.contract';

@Injectable()
export class NotificationProvider implements NotificationProviderContract {
  private socketServer!: Server;

  setServer(server: Server) {
    this.socketServer = server;
  }

  sendToProducer(producerId: string, notification: Notification) {
    this.socketServer
      .to(`producer-${producerId}`)
      .emit('notification', notification);
  }

  sendtoAll(notification: Notification) {
    this.socketServer.emit('notification', notification);
  }
}
