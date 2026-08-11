import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationProviderContract } from '../../domain/providers/notificationProvider.contract';
import { Notification } from 'src/modules/notification/domain/entities/notification.entity';
import { NotificationContract } from '../../domain/repositories/notificationRepository.contract';
import type { EmitterPayload } from 'src/shared/domain/providers/emitterProvider.contract';
import { IdGeneratorContract } from 'src/shared/domain/providers/idGenerator.contract';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class CropCreatedListener {
  constructor(
    private readonly notificationService: NotificationProviderContract,
    private readonly notificationRepository: NotificationContract,
    private readonly idGenerator: IdGeneratorContract,
    @InjectPinoLogger(CropCreatedListener.name)
    private readonly logger: PinoLogger,
  ) {}

  @OnEvent('crop.created', { async: true })
  async handleCropCreatedEvent(
    payload: Omit<EmitterPayload<{ cropName: string }>, 'event'>,
  ) {
    try {
      const notification = Notification.create({
        notificationId: this.idGenerator.generate(),
        event: 'crop.created',
        title: 'Nova safra cadastrada',
        content: `A safra "${payload.data.cropName}" foi cadastrada com sucesso.`,
      });

      await this.notificationRepository.create(
        payload.producerId,
        notification,
      );

      this.notificationService.sendToProducer(payload.producerId, notification);
    } catch (error) {
      this.logger.error(error, '[CropCreatedListener] Error handling event');
    }
  }
}
