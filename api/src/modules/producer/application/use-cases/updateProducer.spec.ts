import { describe, it, expect, vi, beforeEach, Mocked } from 'vitest';
import { UpdateProducerUseCase } from './updateProducer';
import { ProducerContract } from '../../domain/repositories/producerRepository.contract';
import { Producer } from '../../domain/entities/producer.entity';

describe('UpdateProducerUseCase', () => {
  let useCase: UpdateProducerUseCase;
  let mockProducerRepository: Mocked<ProducerContract>;

  beforeEach(() => {
    mockProducerRepository = {
      create: vi.fn(),
      findById: vi.fn(),
      update: vi.fn(),
      remove: vi.fn(),
    };

    useCase = new UpdateProducerUseCase(mockProducerRepository);
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
