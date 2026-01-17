import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { hash } from 'bcryptjs';
import { UpdateProducerDTO, CreateProducerInput, ProducerOutput } from './dto';
import { ProducerContract } from './contract';

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

    const producer = await this.producerRepository.create(parsedProducer);

    return producer;
  }

  async update(id: string, data: UpdateProducerDTO): Promise<ProducerOutput> {
    if (!data.email && !data.username) {
      throw new BadRequestException('No fields to update');
    }

    const producer = await this.producerRepository.update(id, data);

    return producer;
  }

  async remove(id: string): Promise<void> {
    await this.producerRepository.remove(id);
  }

  async isOwner(idProducer: string, idService: string): Promise<boolean> {
    const result = await this.producerRepository.isOwner(idProducer, idService);

    if (!result) {
      throw new ForbiddenException();
    }

    const isOwner = result.id_producer === idService;

    return isOwner;
  }
}
