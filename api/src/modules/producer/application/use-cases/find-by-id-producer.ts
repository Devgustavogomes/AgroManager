import { Injectable, NotFoundException } from '@nestjs/common';
import { ProducerContract } from '../../domain/repositories/producer.repository.contract';
import { ProducerOutput } from '../dtos/output.dto';
@Injectable()
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
