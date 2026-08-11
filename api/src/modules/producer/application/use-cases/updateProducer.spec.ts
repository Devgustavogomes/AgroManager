import { describe, it, expect, vi, beforeEach, Mocked } from 'vitest';
import { UpdateProducerUseCase } from './updateProducer';
import { ProducerContract } from '../../domain/repositories/producerRepository.contract';
import { Producer } from '../../domain/entities/producer.entity';
import { EventEmitterContract } from 'src/shared/domain/providers/emitterProvider.contract';
import { ProducerMapper } from '../../infrastructure/producer.mapper';
import { makeFakeProducer } from 'test/factories/makeProducer';
import { NotFoundError } from 'src/shared/domain/errors/notFoundError';

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

    const producerMock = makeFakeProducer();

    const getDomainEvents = vi.spyOn(Producer.prototype, 'getDomainEvents');

    const clearDomainEvents = vi.spyOn(Producer.prototype, 'clearDomainEvents');

    const producerMapper = vi.spyOn(ProducerMapper, 'toResponse');

    mockProducerRepository.findById.mockResolvedValue(producerMock);
    mockProducerRepository.update.mockResolvedValue(producerMock);

    await useCase.execute('some-id', producerUpdatePayload);

    expect(mockProducerRepository.update).toHaveBeenCalledWith(
      'some-id',
      producerMock,
    );

    expect(mockProducerRepository.update).toHaveBeenCalledOnce();

    expect(getDomainEvents).toHaveBeenCalledOnce();

    expect(mockEmitterProvider.emit).toHaveBeenCalled();

    expect(clearDomainEvents).toHaveBeenCalledOnce();
    expect(producerMapper).toHaveBeenCalledOnce();
  });

  it('should throw NotFoundError if producer is not found', async () => {
    mockProducerRepository.findById.mockResolvedValue(undefined);

    await expect(useCase.execute('non-existing-id', {})).rejects.toThrow(
      NotFoundError,
    );
  });
});
