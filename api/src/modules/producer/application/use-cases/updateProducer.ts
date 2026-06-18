import { Injectable, NotFoundException } from '@nestjs/common';
import { ProducerContract } from '../../domain/repositories/producerRepository.contract';
import { ProducerOutput } from '../dto/output.dto';
import { UpdateProducerDTO } from '../dto/update.dto';
import { ProducerMapper } from '../../infrastructure/persistence/producer.mapper';
@Injectable()
export class UpdateProducerUseCase {
  constructor(private readonly producerRepository: ProducerContract) {}
  async execute(id: string, data: UpdateProducerDTO): Promise<ProducerOutput> {
    const producer = await this.producerRepository.findById(id);

    if (!producer) {
      throw new NotFoundException('Producer not found');
    }

    if (data.email) {
      producer.email = data.email;
    }

    if (data.username) {
      producer.username = data.username;
    }

    const result = await this.producerRepository.update(id, producer);

    return ProducerMapper.toResponse([result])[0];
  }
}
