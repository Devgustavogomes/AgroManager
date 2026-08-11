import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PropertyCreatedListener } from './propertyCreated.listener';
import { NotificationProviderContract } from '../../domain/providers/notificationProvider.contract';
import { NotificationContract } from '../../domain/repositories/notificationRepository.contract';
import { PinoLogger } from 'nestjs-pino';
import { Mocked } from 'vitest';
import { IdGeneratorContract } from 'src/shared/domain/providers/idGenerator.contract';
import { makeFakeNotification } from '../../../../../test/factories/makeNotification';

describe('PropertyCreatedListener', () => {
  let mockNotificationProvider: Mocked<NotificationProviderContract>;
  let mockNotificationRepository: Mocked<NotificationContract>;
  let mockLogger: Mocked<PinoLogger>;
  let mockIdGenerator: Mocked<IdGeneratorContract>;
  let listener: PropertyCreatedListener;

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

    listener = new PropertyCreatedListener(
      mockNotificationProvider,
      mockNotificationRepository,
      mockIdGenerator,
      mockLogger,
    );
  });

  it('Should handle property.created event successfully', async () => {
    const fakeNotification = makeFakeNotification();
    const payload = {
      producerId: 'producer-123',
      data: {
        propertyName: 'Fazenda do Sol',
        city: 'São Paulo',
        state: 'SP',
        slug: 'fazenda-do-sol',
      },
    };
    mockNotificationRepository.create.mockResolvedValueOnce(fakeNotification);

    await listener.handlePropertyCreatedEvent(payload);

    expect(mockNotificationRepository.create).toHaveBeenCalledOnce();
    expect(mockNotificationProvider.sendToProducer).toHaveBeenCalledOnce();
    expect(mockLogger.error).not.toHaveBeenCalled();
  });

  it('Should log error if handling fails', async () => {
    const payload = {
      producerId: 'producer-123',
      data: {
        propertyName: 'Fazenda do Sol',
        city: 'São Paulo',
        state: 'SP',
        slug: 'fazenda-do-sol',
      },
    };

    const error = new Error('Database Error');
    mockNotificationRepository.create.mockRejectedValueOnce(error);

    await listener.handlePropertyCreatedEvent(payload);

    expect(mockLogger.error).toHaveBeenCalledOnce();
    expect(mockLogger.error).toHaveBeenCalledWith(
      error,
      '[PropertyCreatedListener] Error handling event',
    );
  });
});
