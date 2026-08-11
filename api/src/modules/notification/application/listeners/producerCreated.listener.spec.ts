import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProducerCreatedListener } from './producerCreated.listener';
import { NotificationProviderContract } from '../../domain/providers/notificationProvider.contract';
import { NotificationContract } from '../../domain/repositories/notificationRepository.contract';
import { PinoLogger } from 'nestjs-pino';
import { Mocked } from 'vitest';
import { IdGeneratorContract } from 'src/shared/domain/providers/idGenerator.contract';
import { makeFakeNotification } from '../../../../../test/factories/makeNotification';

describe('ProducerCreatedListener', () => {
  let mockNotificationProvider: Mocked<NotificationProviderContract>;
  let mockNotificationRepository: Mocked<NotificationContract>;
  let mockLogger: Mocked<PinoLogger>;
  let mockIdGenerator: Mocked<IdGeneratorContract>;
  let listener: ProducerCreatedListener;

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

    listener = new ProducerCreatedListener(
      mockNotificationProvider,
      mockNotificationRepository,
      mockIdGenerator,
      mockLogger,
    );
  });

  it('Should handle producer.created event successfully', async () => {
    const fakeNotification = makeFakeNotification();
    const payload = {
      producerId: 'producer-123',
      data: { username: 'john_doe' },
    };
    mockNotificationRepository.create.mockResolvedValueOnce(fakeNotification);

    await listener.handleProducerCreatedEvent(payload);

    expect(mockNotificationRepository.create).toHaveBeenCalledOnce();
    expect(mockNotificationProvider.sendToProducer).toHaveBeenCalledOnce();
    expect(mockLogger.error).not.toHaveBeenCalled();
  });

  it('Should log error if handling fails', async () => {
    const payload = {
      producerId: 'producer-123',
      data: { username: 'john_doe' },
    };

    const error = new Error('Database Error');
    mockNotificationRepository.create.mockRejectedValueOnce(error);

    await listener.handleProducerCreatedEvent(payload);

    expect(mockLogger.error).toHaveBeenCalledOnce();
    expect(mockLogger.error).toHaveBeenCalledWith(
      error,
      '[ProducerCreatedListener] Error handling event',
    );
  });
});
