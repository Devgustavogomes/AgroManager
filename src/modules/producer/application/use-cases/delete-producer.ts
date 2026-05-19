import { ProducerContract } from '../../domain/repositories/producer.repository.interface';

export class DeleteProducerUseCase {
  constructor(private readonly producerRepository: ProducerContract) {}

  async execute(id: string): Promise<void> {
    await this.producerRepository.remove(id);
  }
}
