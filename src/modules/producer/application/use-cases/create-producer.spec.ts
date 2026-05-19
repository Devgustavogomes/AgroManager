import { CreateProducerUseCase } from './create-producer';
import { InMemoryProducerRepository } from '../../infrastructure/persistence/in-memory/in-memory-producer.repository';

describe('CreateProducerUseCase', () => {
  let inMemoryProducerRepository: InMemoryProducerRepository;
  let createProducerUseCase: CreateProducerUseCase;

  beforeAll(() => {
    inMemoryProducerRepository = new InMemoryProducerRepository();
    createProducerUseCase = new CreateProducerUseCase(
      inMemoryProducerRepository,
    );
  });

  it('should create a producer', async () => {
    const producer = await createProducerUseCase.execute({
      username: 'Gustavo',
      email: 'gustavo@example.com',
      password: 'Password123!',
    });

    expect(producer).toBeDefined();
    expect(producer.idProducer).toBeDefined();
    expect(producer.username).toBe('Gustavo');
    expect(producer.email).toBe('gustavo@example.com');
    expect(inMemoryProducerRepository.items.length).toBe(1);
  });
});
