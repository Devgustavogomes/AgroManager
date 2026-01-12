import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ProducerRepository } from './producer.repository';
import { hash } from 'bcryptjs';
import { producerOutput } from './dto/producerOutput.dto';
import {
  UpdateProducerDTO,
  CreateProducerInput,
} from './dto/producerInput.dto';

@Injectable()
export class ProducerService {
  constructor(private readonly producerRepository: ProducerRepository) {}

  async findAll(): Promise<producerOutput[]> {
    const producers = await this.producerRepository.findAll();

    return producers;
  }

  async findOne(id: string): Promise<producerOutput> {
    const producer = await this.producerRepository.findOne(id);

    return producer;
  }

  async create(data: CreateProducerInput): Promise<producerOutput> {
    const { password, ...rest } = data;

    const hashedPassword = await hash(password, 10);

    const parsedProducer = {
      ...rest,
      password: hashedPassword,
    };

    const producer = await this.producerRepository.create(parsedProducer);

    return producer;
  }

  async update(id: string, data: UpdateProducerDTO): Promise<producerOutput> {
    if (!data.cpf_or_cnpj && !data.username) {
      throw new BadRequestException('Nenhum campo para atualizar');
    }

    const producer = await this.producerRepository.update(id, data);

    return producer;
  }

  async remove(id: string): Promise<void> {
    await this.producerRepository.remove(id);
  }

  async findOwner(id: string): Promise<{ id_producer: string } | undefined> {
    const result = await this.producerRepository.findOwner(id);

    if (!result) {
      throw new ForbiddenException();
    }

    return result;
  }
}
