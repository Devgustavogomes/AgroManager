import { Injectable } from '@nestjs/common';
import { ProducerContract } from '../../domain/repositories/producerRepository.contract';
import { ProducerOutput } from '../dto/output.dto';
import { NotFoundError } from 'src/shared/domain/errors/notFoundError';
import { ProducerMapper } from '../../infrastructure/producer.mapper';
@Injectable()
export class FindByIdProducerUseCase {
  constructor(private readonly producerRepository: ProducerContract) {}

  async execute(id: string): Promise<ProducerOutput> {
    const result = await this.producerRepository.findById(id);

    if (!result) {
      throw new NotFoundError('Producer not found');
    }

    return ProducerMapper.toResponse([result])[0];
  }
}
