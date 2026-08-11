import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationProviderContract } from '../../domain/providers/notificationProvider.contract';
import { Notification } from 'src/modules/notification/domain/entities/notification.entity';
import { NotificationContract } from '../../domain/repositories/notificationRepository.contract';
import type { EmitterPayload } from 'src/shared/domain/providers/emitterProvider.contract';
import { IdGeneratorContract } from 'src/shared/domain/providers/idGenerator.contract';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class CultureUpdatedListener {
  constructor(
    private readonly notificationService: NotificationProviderContract,
    private readonly notificationRepository: NotificationContract,
    private readonly idGenerator: IdGeneratorContract,
    @InjectPinoLogger(CultureUpdatedListener.name)
    private readonly logger: PinoLogger,
  ) {}

  @OnEvent('culture.updated', { async: true })
  async handleCultureUpdatedEvent(
    payload: Omit<EmitterPayload<{ cultureName: string }>, 'event'>,
  ) {
    try {
      const notification = Notification.create({
        notificationId: this.idGenerator.generate(),
        event: 'culture.updated',
        title: 'Cultura atualizada',
        content: `A cultura "${payload.data.cultureName}" foi atualizada com sucesso.`,
      });

      await this.notificationRepository.create(
        payload.producerId,
        notification,
      );

      this.notificationService.sendToProducer(payload.producerId, notification);
    } catch (error) {
      this.logger.error(error, '[CultureUpdatedListener] Error handling event');
    }
  }
}
