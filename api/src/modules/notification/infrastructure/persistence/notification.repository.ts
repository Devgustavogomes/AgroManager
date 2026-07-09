import { Injectable } from '@nestjs/common';
import { NotificationContract } from '../../domain/repostories/notificationRepository.contract';
import { DatabaseContract } from '@agromanager/infra/database/contract';
import { Notification } from 'src/shared/domain/entities/notification.entity';
import { NotificationMapper } from '../notification.mapper';
import { NotificationPersistence } from '../../domain/providers/notificationProvider.contract';

@Injectable()
export class NotificationRepository implements NotificationContract {
  constructor(private readonly databaseService: DatabaseContract) {}

  async create(
    producerId: string,
    notification: Notification,
  ): Promise<Notification> {
    const sql = `INSERT INTO "notifications"(
                  "producerId",
                  "event",
                  "title",
                  "content",
                  "link",
                  "read",
                  "createdAt",
                  "updatedAt"
                ) VALUES (
                  $1,
                  $2,
                  $3,
                  $4,
                  $5,
                  $6,
                  $7,
                  NULL
                ) RETURNING *`;

    const params = [
      producerId,
      notification.event,
      notification.title,
      notification.content,
      notification.link ?? null,
      notification.read,
      notification.createdAt,
    ];

    const result = await this.databaseService.query<NotificationPersistence>(
      sql,
      params,
    );

    return NotificationMapper.toDomain(result)[0];
  }

  async findAll(producerId: string): Promise<Notification[]> {
    const sql = `SELECT 
                * FROM "notifications" 
                WHERE "producerId" = $1 
                ORDER BY "createdAt" DESC`;

    const params = [producerId];

    const result = await this.databaseService.query<NotificationPersistence>(
      sql,
      params,
    );

    return NotificationMapper.toDomain(result);
  }

  async delete(notificationId: string): Promise<void> {
    const sql = `DELETE FROM "notifications"
                WHERE "notificationId" = $1`;

    const params = [notificationId];

    await this.databaseService.query(sql, params);
  }

  async markAsRead(notificationId: string): Promise<void> {
    const sql = `UPDATE "notifications"
                SET "read" = true
                WHERE "notificationId" = $1`;

    const params = [notificationId];

    await this.databaseService.query(sql, params);
  }
}
