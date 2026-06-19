import { Injectable } from '@nestjs/common';
import { ProducerContract } from '../../domain/repositories/producerRepository.contract';

@Injectable()
export class DeleteProducerUseCase {
  constructor(private readonly producerRepository: ProducerContract) {}

  async execute(id: string): Promise<void> {
    await this.producerRepository.remove(id);
  }
}
