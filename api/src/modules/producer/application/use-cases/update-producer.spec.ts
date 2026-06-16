import { describe, it, expect, vi, beforeEach, Mocked } from 'vitest';
import { UpdateProducerUseCase } from './update-producer';
import { ProducerContract } from '../../domain/repositories/producer.repository.interface';
import { BadRequestException } from '@nestjs/common';
import { ProducerOutput } from '../dtos/output.dto';
import { Role } from '../../../../shared/types/role';

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
    const mockProducerOutput: ProducerOutput = {
      idProducer: 'some-id',
      username: 'producer2',
      email: 'producer@gmail.com',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      role: Role.USER,
    };

    mockProducerRepository.update.mockResolvedValue(mockProducerOutput);

    await useCase.execute('some-id', producerUpdatePayload);

    expect(mockProducerRepository.update).toHaveBeenCalledWith(
      'some-id',
      producerUpdatePayload,
    );
    expect(mockProducerRepository.update).toHaveBeenCalledOnce();
  });

  it('should throw BadRequestException if no fields are provided', async () => {
    await expect(useCase.execute('some-id', {})).rejects.toThrow(
      BadRequestException,
    );
  });
});
