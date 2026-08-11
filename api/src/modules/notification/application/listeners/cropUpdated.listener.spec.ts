import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CropUpdatedListener } from './cropUpdated.listener';
import { NotificationProviderContract } from '../../domain/providers/notificationProvider.contract';
import { NotificationContract } from '../../domain/repositories/notificationRepository.contract';
import { PinoLogger } from 'nestjs-pino';
import { Mocked } from 'vitest';
import { IdGeneratorContract } from 'src/shared/domain/providers/idGenerator.contract';
import { makeFakeNotification } from '../../../../../test/factories/makeNotification';

describe('CropUpdatedListener', () => {
  let mockNotificationProvider: Mocked<NotificationProviderContract>;
  let mockNotificationRepository: Mocked<NotificationContract>;
  let mockLogger: Mocked<PinoLogger>;
  let mockIdGenerator: Mocked<IdGeneratorContract>;
  let listener: CropUpdatedListener;

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

    mockIdGenerator = {
      generate: vi.fn().mockReturnValue('test-uuid'),
    };

    listener = new CropUpdatedListener(
      mockNotificationProvider,
      mockNotificationRepository,
      mockIdGenerator,
      mockLogger,
    );
  });

  it('Should handle crop.updated event successfully', async () => {
    const fakeNotification = makeFakeNotification();
    const payload = {
      producerId: 'producer-123',
      data: { cropName: 'Safra de Milho' },
    };
    mockNotificationRepository.create.mockResolvedValueOnce(fakeNotification);

    await listener.handleCropUpdatedEvent(payload);

    expect(mockNotificationRepository.create).toHaveBeenCalledOnce();
    expect(mockNotificationProvider.sendToProducer).toHaveBeenCalledOnce();
    expect(mockLogger.error).not.toHaveBeenCalled();
  });

  it('Should log error if handling fails', async () => {
    const payload = {
      producerId: 'producer-123',
      data: { cropName: 'Safra de Milho' },
    };

    const error = new Error('Database Error');
    mockNotificationRepository.create.mockRejectedValueOnce(error);

    await listener.handleCropUpdatedEvent(payload);

    expect(mockLogger.error).toHaveBeenCalledOnce();
    expect(mockLogger.error).toHaveBeenCalledWith(
      error,
      '[CropUpdatedListener] Error handling event',
    );
  });
});
