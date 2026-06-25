import { describe, it, expect, vi, beforeEach, Mocked } from 'vitest';
import { CreateProducerUseCase } from './createProducer';
import { ProducerContract } from '../../domain/repositories/producerRepository.contract';

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
    mockProducerRepository.create.mockImplementation((p) => Promise.resolve(p));

    await useCase.execute({
      username: 'Gustavo',
      email: 'gustavo@example.com',
      password: 'Password123!',
    });

    expect(mockProducerRepository.create).toHaveBeenCalledOnce();
  });
});
