import { ForbiddenException, Injectable } from '@nestjs/common';
import { ProducerRepository } from './producer.repository';
import { hash } from 'bcryptjs';
import { producerOutput } from './dto/producerOutput.dto';
import {
  changeProducerDTO,
  CreateProducerInput,
} from './dto/producerInput.dto';

@Injectable()
export class ProducerService {
  constructor(private readonly producerRepository: ProducerRepository) {}

  async getProducers(): Promise<producerOutput[]> {
    const producers = await this.producerRepository.getProducers();

    return producers;
  }

  async getProducerById(id: string): Promise<producerOutput> {
    const producer = await this.producerRepository.getProducerById(id);

    return producer[0];
  }

  async create(data: CreateProducerInput): Promise<producerOutput> {
    const { password, ...rest } = data;

    const hashedPassword = await hash(password, 10);

    const parsedProducer = {
      ...rest,
      hashedPassword,
    };

    const producer = await this.producerRepository.create(parsedProducer);

    return producer[0];
  }

  async change(id: string, data: changeProducerDTO): Promise<producerOutput> {
    const producer = await this.producerRepository.change(id, data);

    return producer[0];
  }

  async delete(id: string): Promise<void> {
    await this.producerRepository.delete(id);
  }

  async findOwner(id: string): Promise<{ id: string } | null> {
    const result = await this.producerRepository.findOwner(id);

    if (!result) {
      throw new ForbiddenException();
    }
    return result;
  }
}
