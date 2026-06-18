import { Injectable, NotFoundException } from '@nestjs/common';
import { ProducerContract } from '../../domain/repositories/producerRepository.contract';
import { ProducerOutput } from '../dto/output.dto';
import { ProducerMapper } from '../../infrastructure/persistence/producer.mapper';
@Injectable()
export class FindByIdProducerUseCase {
  constructor(private readonly producerRepository: ProducerContract) {}

  async execute(id: string): Promise<ProducerOutput> {
    const result = await this.producerRepository.findById(id);

    if (!result) {
      throw new NotFoundException('Producer not found');
    }

    return ProducerMapper.toResponse([result])[0];
  }
}
