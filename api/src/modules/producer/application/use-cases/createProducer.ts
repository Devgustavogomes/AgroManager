import { Injectable } from '@nestjs/common';
import { ProducerContract } from '../../domain/repositories/producerRepository.contract';
import { CreateProducerInput } from '../dto/create.dto';
import { ProducerOutput } from '../dto/output.dto';
import { hash } from 'bcryptjs';
import { Producer } from '../../domain/entities/producer.entity';
import { ProducerMapper } from '../../infrastructure/persistence/producer.mapper';

@Injectable()
export class CreateProducerUseCase {
  constructor(private readonly producerRepository: ProducerContract) {}

  async execute(data: CreateProducerInput): Promise<ProducerOutput> {
    const { password, ...rest } = data;

    const hashedPassword = await hash(password, 10);

    const producer = Producer.create({
      ...rest,
      hashedPassword,
    });

    const result = await this.producerRepository.create(producer);

    return ProducerMapper.toResponse([result])[0];
  }
}
