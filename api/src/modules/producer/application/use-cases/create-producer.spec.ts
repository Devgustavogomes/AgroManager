import { describe, it, expect, vi, beforeEach, Mocked } from 'vitest';
import { CreateProducerUseCase } from './create-producer';
import { ProducerContract } from '../../domain/repositories/producer.repository.contract';
import { ProducerOutput } from '../dtos/output.dto';
import { Role } from '../../../../shared/types/role';

vi.mock('bcryptjs', () => ({
  hash: vi.fn().mockResolvedValue('hashed_password'),
}));

describe('CreateProducerUseCase', () => {
  let useCase: CreateProducerUseCase;
  let mockProducerRepository: Mocked<ProducerContract>;

  beforeEach(() => {
    mockProducerRepository = {
      create: vi.fn(),
      findById: vi.fn(),
      update: vi.fn(),
      remove: vi.fn(),
    };

    useCase = new CreateProducerUseCase(mockProducerRepository);
  });

  it('should create a producer', async () => {
    const mockProducerOutput: ProducerOutput = {
      idProducer: 'some-id',
      username: 'Gustavo',
      email: 'gustavo@example.com',
      createdAt: new Date().toISOString(),
      updatedAt: null,
      role: Role.USER,
    };

    mockProducerRepository.create.mockResolvedValue(mockProducerOutput);

    await useCase.execute({
      username: 'Gustavo',
      email: 'gustavo@example.com',
      password: 'Password123!',
    });

    expect(mockProducerRepository.create).toHaveBeenCalledOnce();
  });
});
