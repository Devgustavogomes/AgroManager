import { InMemoryProducerRepository } from './../../infrastructure/persistence/in-memory/in-memory-producer.repository';
import { ProducerEntity } from '../../domain/entities/producer.entity';
import { UpdateProducerUseCase } from './update-producer';
describe('UpdateProducerUseCase', () => {
  let inMemoryProducerRepository: InMemoryProducerRepository;
  let updateProducerUseCase: UpdateProducerUseCase;

  beforeAll(() => {
    inMemoryProducerRepository = new InMemoryProducerRepository();
    updateProducerUseCase = new UpdateProducerUseCase(
      inMemoryProducerRepository,
    );
  });

  test('shoul update a producer', async () => {
    const producer = ProducerEntity.create({
      email: 'producer@gmail.com',
      password_hash: 'asasas!23@',
      username: 'producer1',
    });

    const producerResult = await inMemoryProducerRepository.create(producer);

    const producerUpdatePayload = { username: 'producer2' };

    const producerUpdated = await updateProducerUseCase.execute(
      producerResult.idProducer,
      producerUpdatePayload,
    );

    expect(producerUpdated.username).toBe(producerUpdatePayload.username);
    expect(producerUpdated.updatedAt).toEqual(expect.any(String));
  });
});
