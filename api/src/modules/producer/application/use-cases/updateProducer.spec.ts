import { describe, it, expect, vi, beforeEach, Mocked } from 'vitest';
import { UpdateProducerUseCase } from './updateProducer';
import { ProducerContract } from '../../domain/repositories/producerRepository.contract';
import { Producer } from '../../domain/entities/producer.entity';
import { EventEmitterContract } from 'src/shared/domain/providers/emitterProvider.contract';

describe('UpdateProducerUseCase', () => {
  let useCase: UpdateProducerUseCase;
  let mockProducerRepository: Mocked<ProducerContract>;
  let mockEmitterProvider: Mocked<EventEmitterContract>;

  beforeEach(() => {
    mockProducerRepository = {
      create: vi.fn(),
      findById: vi.fn(),
      update: vi.fn(),
      remove: vi.fn(),
    };

    mockEmitterProvider = {
      emit: vi.fn(),
    };

    useCase = new UpdateProducerUseCase(
      mockProducerRepository,
      mockEmitterProvider,
    );
  });

  it('should update a producer', async () => {
    const producerUpdatePayload = { username: 'producer2' };
    const producerMock = Producer.create({
      username: 'Gustavo',
      email: 'gustavo@example.com',
      hashedPassword: 'hashed_password',
    });

    mockProducerRepository.findById.mockResolvedValue(producerMock);
    mockProducerRepository.update.mockResolvedValue(producerMock);

    await useCase.execute('some-id', producerUpdatePayload);

    expect(mockProducerRepository.update).toHaveBeenCalledWith(
      'some-id',
      producerMock,
    );
    expect(mockProducerRepository.update).toHaveBeenCalledOnce();
  });
});
