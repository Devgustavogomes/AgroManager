import { describe, it, expect, vi, beforeEach, Mocked } from 'vitest';
import { UpdateProducerUseCase } from './updateProducer';
import { ProducerContract } from '../../domain/repositories/producerRepository.contract';
import { BadRequestException } from '@nestjs/common';
import { ProducerOutput } from '../dto/output.dto';
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

    await useCase.execute('some-id', producerUpdatePayload);

    expect(mockProducerRepository.update).toHaveBeenCalledWith(
      'some-id',
      producerUpdatePayload,
    );
    expect(mockProducerRepository.update).toHaveBeenCalledOnce();
  });
});
