import { FindByIdProducerUseCase } from './find-by-id-producer';
import { InMemoryProducerRepository } from '../../infrastructure/persistence/in-memory/in-memory-producer.repository';
import { NotFoundException } from '@nestjs/common';
import { ProducerEntity } from '../../domain/entities/producer.entity';

describe('FindByIdProducerUseCase', () => {
  let inMemoryProducerRepository: InMemoryProducerRepository;
  let findByIdProducerUseCase: FindByIdProducerUseCase;

  beforeAll(() => {
    inMemoryProducerRepository = new InMemoryProducerRepository();
    findByIdProducerUseCase = new FindByIdProducerUseCase(
      inMemoryProducerRepository,
    );
  });

  it('should find a producer by id', async () => {
    const entity = ProducerEntity.create({
      username: 'Gustavo Gomes',
      email: 'gustavo@example.com',
      password_hash: 'password',
    });

    const createdProducer = await inMemoryProducerRepository.create(entity);

    const result = await findByIdProducerUseCase.execute(
      createdProducer.idProducer,
    );

    expect(result).toBeDefined();
    expect(result.idProducer).toBe(createdProducer.idProducer);
    expect(result.username).toBe('Gustavo Gomes');
    expect(result.email).toBe('gustavo@example.com');
  });

  it('should throw NotFoundException if producer is not found', async () => {
    await expect(
      findByIdProducerUseCase.execute('non-existing-id'),
    ).rejects.toThrow(NotFoundException);
  });
});
