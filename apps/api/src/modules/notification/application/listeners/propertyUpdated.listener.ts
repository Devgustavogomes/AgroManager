import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationProviderContract } from '../../domain/providers/notificationProvider.contract';
import { Notification } from 'src/modules/notification/domain/entities/notification.entity';
import { NotificationContract } from '../../domain/repositories/notificationRepository.contract';
import type { EmitterPayload } from 'src/shared/domain/providers/emitterProvider.contract';
import { IdGeneratorContract } from 'src/shared/domain/providers/idGenerator.contract';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class PropertyUpdatedListener {
  constructor(
    private readonly notificationService: NotificationProviderContract,
    private readonly notificationRepository: NotificationContract,
    private readonly idGenerator: IdGeneratorContract,
    @InjectPinoLogger(PropertyUpdatedListener.name)
    private readonly logger: PinoLogger,
  ) {}

  @OnEvent('property.updated', { async: true })
  async handlePropertyUpdatedEvent(
    payload: Omit<
      EmitterPayload<{
        propertyName: string;
        city: string;
        state: string;
        slug: string;
      }>,
      'event'
    >,
  ) {
    try {
      const notification = Notification.create({
        notificationId: this.idGenerator.generate(),
        event: 'property.updated',
        title: 'Propriedade atualizada',
        content: `A propriedade "${payload.data.propertyName}" em ${payload.data.city}-${payload.data.state} foi atualizada com sucesso, clique para gerenciá-la.`,
        link: `/property/${payload.data.slug}`,
      });

      await this.notificationRepository.create(
        payload.producerId,
        notification,
      );

      this.notificationService.sendToProducer(payload.producerId, notification);
    } catch (error) {
      this.logger.error(
        error,
        '[PropertyUpdatedListener] Error handling event',
      );
    }
  }
}
