import { describe, it, expect, vi, beforeEach, Mocked } from 'vitest';
import { FindByIdProducerUseCase } from './findByIdProducer';
import { ProducerContract } from '../../domain/repositories/producerRepository.contract';
import { NotFoundException } from '@nestjs/common';
import { ProducerOutput } from '../dtos/output.dto';
import { Role } from '../../../../shared/types/role';

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
    const mockProducerOutput: ProducerOutput = {
      idProducer: 'some-id',
      username: 'Gustavo Gomes',
      email: 'gustavo@example.com',
      createdAt: new Date().toISOString(),
      updatedAt: null,
      role: Role.USER,
    };

    mockProducerRepository.findById.mockResolvedValue(mockProducerOutput);

    await useCase.execute('some-id');

    expect(mockProducerRepository.findById).toHaveBeenCalledWith('some-id');
    expect(mockProducerRepository.findById).toHaveBeenCalledOnce();
  });

  it('should throw NotFoundException if producer is not found', async () => {
    mockProducerRepository.findById.mockResolvedValue(undefined);

    await expect(useCase.execute('non-existing-id')).rejects.toThrow(
      NotFoundException,
    );
  });
});
