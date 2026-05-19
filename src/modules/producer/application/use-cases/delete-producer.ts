import { Injectable } from '@nestjs/common';
import { ProducerContract } from '../../domain/repositories/producer.repository.interface';

@Injectable()
export class DeleteProducerUseCase {
  constructor(private readonly producerRepository: ProducerContract) {}

  async execute(id: string): Promise<void> {
    await this.producerRepository.remove(id);
  }
}
