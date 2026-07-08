import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationProviderContract } from '../../domain/providers/notificationProvider.contract';
import { Notification } from 'src/shared/domain/entities/notification.entity';
import { NotificationContract } from '../../domain/repostories/notificationRepository.contract';
import type { EmitterPayload } from 'src/shared/domain/providers/emitterProvider.contract';

@Injectable()
export class CropUpdatedListener {
  constructor(
    private readonly notificationService: NotificationProviderContract,
    private readonly notificationRepository: NotificationContract,
  ) {}

  @OnEvent('crop.updated', { async: true })
  async handleCropUpdatedEvent(
    payload: Omit<EmitterPayload<Notification>, 'event'>,
  ) {
    await this.notificationRepository.create(payload.producerId, payload.data);

    this.notificationService.sendToProducer(payload.producerId, payload.data);
  }
}
