/* eslint-disable @typescript-eslint/unbound-method */
import { describe, it, expect, vi, beforeEach, Mocked } from 'vitest';
import { DeleteProducerUseCase } from './delete-producer';
import { ProducerContract } from '../../domain/repositories/producer.repository.interface';

describe('DeleteProducerUseCase', () => {
  let useCase: DeleteProducerUseCase;
  let mockProducerRepository: Mocked<ProducerContract>;

  beforeEach(() => {
    mockProducerRepository = {
      create: vi.fn(),
      findById: vi.fn(),
      update: vi.fn(),
      remove: vi.fn(),
    };

    useCase = new DeleteProducerUseCase(mockProducerRepository);
  });

  it('should delete a producer', async () => {
    mockProducerRepository.remove.mockResolvedValue();

    await useCase.execute('some-id');

    expect(mockProducerRepository.remove).toHaveBeenCalledWith('some-id');
    expect(mockProducerRepository.remove).toHaveBeenCalledOnce();
  });
});
