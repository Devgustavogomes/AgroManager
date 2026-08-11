import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationProviderContract } from '../../domain/providers/notificationProvider.contract';
import { Notification } from 'src/modules/notification/domain/entities/notification.entity';
import { NotificationContract } from '../../domain/repositories/notificationRepository.contract';
import type { EmitterPayload } from 'src/shared/domain/providers/emitterProvider.contract';
import { IdGeneratorContract } from 'src/shared/domain/providers/idGenerator.contract';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class ProducerCreatedListener {
  constructor(
    private readonly notificationService: NotificationProviderContract,
    private readonly notificationRepository: NotificationContract,
    private readonly idGenerator: IdGeneratorContract,
    @InjectPinoLogger(ProducerCreatedListener.name)
    private readonly logger: PinoLogger,
  ) {}

  @OnEvent('producer.created', { async: true })
  async handleProducerCreatedEvent(
    payload: Omit<EmitterPayload<{ username: string }>, 'event'>,
  ) {
    try {
      const notification = Notification.create({
        notificationId: this.idGenerator.generate(),
        event: 'producer.created',
        title: 'Produtor cadastrado',
        content: `Seu cadastro foi realizado com sucesso. Bem-vindo ao AgroManager!`,
      });

      await this.notificationRepository.create(
        payload.producerId,
        notification,
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
