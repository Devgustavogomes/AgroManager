import { describe, it, expect, vi, beforeEach, Mocked } from 'vitest';
import { FindByIdProducerUseCase } from './findByIdProducer';
import { ProducerContract } from '../../domain/repositories/producerRepository.contract';
import { NotFoundError } from 'src/shared/domain/errors/notFoundError';
import { makeFakeProducer } from 'test/factories/makeProducer';

describe('FindByIdProducerUseCase', () => {
  let useCase: FindByIdProducerUseCase;
  let mockProducerRepository: Mocked<ProducerContract>;

  beforeEach(() => {
    mockProducerRepository = {
      create: vi.fn(),
      findById: vi.fn(),
      update: vi.fn(),
      remove: vi.fn(),
    };

    useCase = new FindByIdProducerUseCase(mockProducerRepository);
  });

  it('should find a producer by id', async () => {
    const producer = makeFakeProducer();

    mockProducerRepository.findById.mockResolvedValue(producer);

    await useCase.execute('some-id');

    expect(mockProducerRepository.findById).toHaveBeenCalledWith('some-id');
    expect(mockProducerRepository.findById).toHaveBeenCalledOnce();
  });

  it('should throw NotFoundError if producer is not found', async () => {
    mockProducerRepository.findById.mockResolvedValue(undefined);

    await expect(useCase.execute('non-existing-id')).rejects.toThrow(
      NotFoundError,
    );
  });
});
