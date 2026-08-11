import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CropCreatedListener } from './cropCreated.listener';
import { NotificationProviderContract } from '../../domain/providers/notificationProvider.contract';
import { NotificationContract } from '../../domain/repositories/notificationRepository.contract';
import { PinoLogger } from 'nestjs-pino';
import { Mocked } from 'vitest';
import { makeFakeNotification } from '../../../../../test/factories/makeNotification';

describe('CropCreatedListener', () => {
  let mockNotificationProvider: Mocked<NotificationProviderContract>;
  let mockNotificationRepository: Mocked<NotificationContract>;
  let mockLogger: Mocked<PinoLogger>;
  let listener: CropCreatedListener;

  beforeEach(() => {
    mockNotificationProvider = {
      sendToProducer: vi.fn(),
    } as unknown as Mocked<NotificationProviderContract>;

    mockNotificationRepository = {
      create: vi.fn(),
    } as unknown as Mocked<NotificationContract>;

    mockLogger = {
      error: vi.fn(),
    } as unknown as Mocked<PinoLogger>;

    listener = new CropCreatedListener(
      mockNotificationProvider,
      mockNotificationRepository,
      mockLogger,
    );
  });

  it('Should handle crop.created event successfully', async () => {
    const fakeNotification = makeFakeNotification();
    const payload = {
      producerId: 'producer-123',
      data: fakeNotification,
    };
    mockNotificationRepository.create.mockResolvedValueOnce(fakeNotification);

    await listener.handleCropCreatedEvent(payload);

    expect(mockNotificationRepository.create).toHaveBeenCalledOnce();
    expect(mockNotificationRepository.create).toHaveBeenCalledWith(
      payload.producerId,
      payload.data,
    );
    expect(mockNotificationProvider.sendToProducer).toHaveBeenCalledOnce();
    expect(mockNotificationProvider.sendToProducer).toHaveBeenCalledWith(
      payload.producerId,
      fakeNotification,
    );
    expect(mockLogger.error).not.toHaveBeenCalled();
  });

  it('Should log error if handling fails', async () => {
    const fakeNotification = makeFakeNotification();
    const payload = {
      producerId: 'producer-123',
      data: fakeNotification,
    };

    const error = new Error('Database Error');
    mockNotificationRepository.create.mockRejectedValueOnce(error);

    await listener.handleCropCreatedEvent(payload);

    expect(mockNotificationRepository.create).toHaveBeenCalledOnce();
    expect(mockNotificationProvider.sendToProducer).not.toHaveBeenCalled();
    expect(mockLogger.error).toHaveBeenCalledOnce();
    expect(mockLogger.error).toHaveBeenCalledWith(
      error,
      '[CropCreatedListener] Error handling event',
    );
  });
});
