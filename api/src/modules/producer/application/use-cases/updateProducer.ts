import { BadRequestException, Injectable } from '@nestjs/common';
import { ProducerContract } from '../../domain/repositories/producerRepository.contract';
import { ProducerOutput } from '../dtos/output.dto';
import { UpdateProducerDTO } from '../dtos/update.dto';
@Injectable()
export class UpdateProducerUseCase {
  constructor(private readonly producerRepository: ProducerContract) {}
  async execute(id: string, data: UpdateProducerDTO): Promise<ProducerOutput> {
    if (!data.email && !data.username) {
      throw new BadRequestException('No fields to update');
    }

    return await this.producerRepository.update(id, data);
  }
}
