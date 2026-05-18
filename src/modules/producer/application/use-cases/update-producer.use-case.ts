import { BadRequestException } from '@nestjs/common';
import { ProducerContract } from '../../domain/repositories/producer.repository.interface';
import { ProducerOutput } from '../dtos/output.dto';
import { UpdateProducerDTO } from '../dtos/update.dto';

export class UpdateProducerUseCase {
  constructor(private readonly producerRepository: ProducerContract) {}
  async execute(id: string, data: UpdateProducerDTO): Promise<ProducerOutput> {
    if (!data.email && !data.username) {
      throw new BadRequestException('No fields to update');
    }

    return await this.producerRepository.update(id, data);
  }
}
