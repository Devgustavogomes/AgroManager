import { Injectable } from '@nestjs/common';
import { ProducerContract } from '../../domain/repositories/producerRepository.contract';
import { ProducerOutput } from '../dto/output.dto';
import { UpdateProducerDTO } from '../dto/update.dto';
import { NotFoundError } from 'src/shared/domain/errors/notFoundError';
import { EventEmitterContract } from 'src/shared/domain/providers/emitterProvider.contract';
import { ProducerMapper } from '../../infrastructure/producer.mapper';
@Injectable()
export class UpdateProducerUseCase {
  constructor(
    private readonly producerRepository: ProducerContract,
    private readonly emitterProvider: EventEmitterContract,
  ) {}
  async execute(id: string, dto: UpdateProducerDTO): Promise<ProducerOutput> {
    const producer = await this.producerRepository.findById(id);

    if (!producer) {
      throw new NotFoundError('Producer not found');
    }

    producer.update(dto);

    const result = await this.producerRepository.update(id, producer);

    producer.getDomainEvents(result.producerId).forEach((event) => {
      this.emitterProvider.emit(event);
    });

    producer.clearDomainEvents();

    return ProducerMapper.toResponse([result])[0];
  }
}
