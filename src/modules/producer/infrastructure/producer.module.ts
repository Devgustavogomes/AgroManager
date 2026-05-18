import { Module } from '@nestjs/common';
import { ProducerController } from '../presentation/producer.controller';
import { ProducerRepository } from './persistence/producer.repository';
import { ProducerContract } from '../domain/repositories/producer.repository.interface';
import { CreateProducerUseCase } from '../application/use-cases/create-producer.use-case';
import { DeleteProducerUseCase } from '../application/use-cases/delete-producer.use-case';
import { UpdateProducerUseCase } from '../application/use-cases/update-producer.use-case';
import { FindByIdProducerUseCase } from '../application/use-cases/find-by-id-producer.use-case';

@Module({
  controllers: [ProducerController],
  providers: [
    CreateProducerUseCase,
    UpdateProducerUseCase,
    DeleteProducerUseCase,
    FindByIdProducerUseCase,
    { provide: ProducerContract, useClass: ProducerRepository },
  ],
})
export class ProducerModule {}
