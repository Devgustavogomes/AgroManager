import { ProducerDTO, ProducerIdDTO } from './dto/producer.dto';
import { Injectable } from '@nestjs/common';
import { ProducerRepository } from './producer.repository';
import { hash } from 'bcryptjs';
import { producerOutput } from './dto/producerOutput.dto';
import { changeProducerDTO } from './dto/producerInput.dto';

@Injectable()
export class ProducerService {
  constructor(private readonly producerRepository: ProducerRepository) {}

  async getProducers(): Promise<producerOutput[]> {
    const producers = await this.producerRepository.getProducers();

    if (!producers) {
      throw new Error('Producers not found');
    }

    return producers;
  }

  async getProducerById(id: ProducerIdDTO): Promise<producerOutput> {
    const producer = await this.producerRepository.getProducerById(id);

    return producer[0];
  }

  async create(data: ProducerDTO): Promise<producerOutput> {
    const { password, ...rest } = data;

    const hashedPassword = await hash(password, 10);

    const parsedProducer = {
      ...rest,
      hashedPassword,
    };

    const producer = await this.producerRepository.create(parsedProducer);

    return producer[0];
  }
  async change(
    id: ProducerIdDTO,
    data: changeProducerDTO,
  ): Promise<producerOutput> {
    const cleanData = Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(data).filter(([_, value]) => value !== undefined),
    );

    const producer = await this.producerRepository.change(id, cleanData);

    return producer[0];
  }

  async delete(id: ProducerIdDTO): Promise<void> {
    await this.producerRepository.delete(id);
  }
}
