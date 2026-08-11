import { describe, it, expect, vi, beforeEach, Mocked } from 'vitest';
import { CreateProducerUseCase } from './createProducer';
import { ProducerContract } from '../../domain/repositories/producerRepository.contract';
import { EventEmitterContract } from 'src/shared/domain/providers/emitterProvider.contract';
import { Producer } from '../../domain/entities/producer.entity';
import { ProducerMapper } from '../../infrastructure/producer.mapper';
import { IdGeneratorContract } from 'src/shared/domain/providers/idGenerator.contract';

describe('CreateProducerUseCase', () => {
  let useCase: CreateProducerUseCase;
  let mockProducerRepository: Mocked<ProducerContract>;
  let mockEmitterProvider: Mocked<EventEmitterContract>;
  let mockIdGenerator: Mocked<IdGeneratorContract>;

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

    mockIdGenerator = {
      generate: vi.fn().mockReturnValue('test-uuid'),
    };

    useCase = new CreateProducerUseCase(
      mockProducerRepository,
      mockEmitterProvider,
      mockIdGenerator,
    );
  });

  it('should create a producer', async () => {
    mockProducerRepository.create.mockImplementation((p) => Promise.resolve(p));

    const getDomainEvents = vi.spyOn(Producer.prototype, 'getDomainEvents');

    const clearDomainEvents = vi.spyOn(Producer.prototype, 'clearDomainEvents');

    const producerMapper = vi.spyOn(ProducerMapper, 'toResponse');

    await useCase.execute({
      username: 'Gustavo',
      email: 'gustavo@example.com',
      password: 'Password123!',
    });

    expect(mockProducerRepository.create).toHaveBeenCalledOnce();

    expect(getDomainEvents).toHaveBeenCalledOnce();

    expect(mockEmitterProvider.emit).toHaveBeenCalled();

    expect(clearDomainEvents).toHaveBeenCalledOnce();
    expect(producerMapper).toHaveBeenCalledOnce();
  });
});
