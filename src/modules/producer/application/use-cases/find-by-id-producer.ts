import { NotFoundException } from '@nestjs/common';
import { ProducerContract } from '../../domain/repositories/producer.repository.interface';
import { ProducerOutput } from '../dtos/output.dto';

export class FindByIdProducerUseCase {
  constructor(private readonly producerRepository: ProducerContract) {}

  async execute(id: string): Promise<ProducerOutput> {
    const producer = await this.producerRepository.findById(id);

    if (!producer) {
      throw new NotFoundException('Producer not found');
    }

    return producer;
  }
}
