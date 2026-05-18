import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { hash } from 'bcryptjs';
import { ProducerContract } from './contract';
import { ProducerOutput } from './DTOs/producerOutput.dto';
import { CreateProducerInput } from './DTOs/createProducer.dto';
import { UpdateProducerDTO } from './DTOs/updateProducer.dto';

@Injectable()
export class ProducerService {
  constructor(private readonly producerRepository: ProducerContract) {}

  async findById(id: string): Promise<ProducerOutput> {
    const producer = await this.producerRepository.findById(id);

    if (!producer) {
      throw new NotFoundException('Producer not found');
    }

    return producer;
  }

  async create(data: CreateProducerInput): Promise<ProducerOutput> {
    const { password, ...rest } = data;

    const hashedPassword = await hash(password, 10);

    const parsedProducer = {
      ...rest,
      password: hashedPassword,
    };

    return await this.producerRepository.create(parsedProducer);
  }

  async update(id: string, data: UpdateProducerDTO): Promise<ProducerOutput> {
    if (!data.email && !data.username) {
      throw new BadRequestException('No fields to update');
    }

    return await this.producerRepository.update(id, data);
  }

  async remove(id: string): Promise<void> {
    await this.producerRepository.remove(id);
  }
}
