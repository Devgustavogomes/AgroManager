import { ProducerEntity } from '../../domain/entities/producer.entity';
import { InMemoryProducerRepository } from '../../infrastructure/persistence/in-memory/in-memory-producer.repository';
import { DeleteProducerUseCase } from './delete-producer';

describe('DeleteProducerUseCase', () => {
  let inMemoryProducerRepository: InMemoryProducerRepository;
  let producerDeleteUseCase: DeleteProducerUseCase;

  beforeAll(() => {
    inMemoryProducerRepository = new InMemoryProducerRepository();
    producerDeleteUseCase = new DeleteProducerUseCase(
      inMemoryProducerRepository,
    );
  });

  test('should be delete a producer', async () => {
    const producer = ProducerEntity.create({
      username: 'deleted',
      password_hash: 'senha123#!',
      email: 'deletedemail@gmail.com',
    });

    const newProducer = await inMemoryProducerRepository.create(producer);

    await producerDeleteUseCase.execute(newProducer.idProducer);

    const result = await inMemoryProducerRepository.findById(
      newProducer.idProducer,
    );

    expect(result).toBeUndefined();
  });
});
