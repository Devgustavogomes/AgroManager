import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationProviderContract } from '../../domain/providers/notificationProvider.contract';
import { Notification } from 'src/shared/domain/entities/notification.entity';
import { NotificationContract } from '../../domain/repositories/notificationRepository.contract';
import type { EmitterPayload } from 'src/shared/domain/providers/emitterProvider.contract';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class ProducerCreatedListener {
  constructor(
    private readonly notificationService: NotificationProviderContract,
    private readonly notificationRepository: NotificationContract,
    @InjectPinoLogger(ProducerCreatedListener.name)
    private readonly logger: PinoLogger,
  ) {}

  @OnEvent('producer.created', { async: true })
  async handleProducerCreatedEvent(
    payload: Omit<EmitterPayload<Notification>, 'event'>,
  ) {
    try {
      const notification = await this.notificationRepository.create(
        payload.producerId,
        payload.data,
      );

      this.notificationService.sendToProducer(payload.producerId, notification);
    } catch (error) {
      this.logger.error(
        error,
        '[ProducerCreatedListener] Error handling event',
      );
    }
  }
}
