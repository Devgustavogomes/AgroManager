import { Injectable } from '@nestjs/common';
import { ProducerContract } from '../../domain/repositories/producerRepository.contract';
import { CreateProducerInput } from '../dto/create.dto';
import { ProducerOutput } from '../dto/output.dto';
import { hash } from 'bcryptjs';
import { Producer } from '../../domain/entities/producer.entity';
import { EventEmitterContract } from 'src/shared/domain/providers/emitterProvider.contract';
import { ProducerMapper } from '../../infrastructure/producer.mapper';

@Injectable()
export class CreateProducerUseCase {
  constructor(
    private readonly producerRepository: ProducerContract,
    private readonly emitterProvider: EventEmitterContract,
  ) {}

  async execute(data: CreateProducerInput): Promise<ProducerOutput> {
    const { password, ...rest } = data;

    const hashedPassword = await hash(password, 10);

    const producer = Producer.create({
      ...rest,
      hashedPassword,
    });

    const result = await this.producerRepository.create(producer);

    producer.getDomainEvents(result.producerId).forEach((event) => {
      this.emitterProvider.emit(event);
    });

    producer.clearDomainEvents();

    return ProducerMapper.toResponse([result])[0];
  }
}
