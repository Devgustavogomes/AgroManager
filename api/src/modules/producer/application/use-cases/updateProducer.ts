import { Injectable } from '@nestjs/common';
import { ProducerContract } from '../../domain/repositories/producerRepository.contract';
import { ProducerOutput } from '../dto/output.dto';
import { UpdateProducerDTO } from '../dto/update.dto';
import { ProducerMapper } from '../../infrastructure/persistence/producer.mapper';
import { NotFoundError } from 'src/shared/domain/errors/notFoundError';
@Injectable()
export class UpdateProducerUseCase {
  constructor(private readonly producerRepository: ProducerContract) {}
  async execute(id: string, dto: UpdateProducerDTO): Promise<ProducerOutput> {
    const producer = await this.producerRepository.findById(id);

    if (!producer) {
      throw new NotFoundError('Producer not found');
    }

    producer.update(dto);

    const result = await this.producerRepository.update(id, producer);

    return ProducerMapper.toResponse([result])[0];
  }
}
