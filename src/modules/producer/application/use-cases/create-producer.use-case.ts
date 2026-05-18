import { Injectable } from '@nestjs/common';
import { ProducerContract } from '../../domain/repositories/producer.repository.interface';
import { CreateProducerInput } from '../dtos/create.dto';
import { ProducerOutput } from '../dtos/output.dto';
import { hash } from 'bcryptjs';
import { ProducerEntity } from '../../domain/entities/producer.entity';

@Injectable()
export class CreateProducerUseCase {
  constructor(private readonly producerRepository: ProducerContract) {}

  async execute(data: CreateProducerInput): Promise<ProducerOutput> {
    const { password, ...rest } = data;

    const hashedPassword = await hash(password, 10);

    const producer = new ProducerEntity({
      ...rest,
      password_hash: hashedPassword,
    });

    return await this.producerRepository.create(producer);
  }
}
