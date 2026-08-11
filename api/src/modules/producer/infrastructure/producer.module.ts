import { Module } from '@nestjs/common';
import { ProducerController } from '../presentation/producer.controller';
import { ProducerRepository } from './persistence/producer.repository';
import { ProducerContract } from '../domain/repositories/producerRepository.contract';
import { CreateProducerUseCase } from '../application/use-cases/createProducer';
import { DeleteProducerUseCase } from '../application/use-cases/deleteProducer';
import { UpdateProducerUseCase } from '../application/use-cases/updateProducer';
import { FindByIdProducerUseCase } from '../application/use-cases/findByIdProducer';
import { EventEmitterContract } from 'src/shared/domain/providers/emitterProvider.contract';
import { EventEmitterProvider } from 'src/shared/infrastructure/providers/socketEmitter.provider';
import { IdGeneratorContract } from 'src/shared/domain/providers/idGenerator.contract';
import { UuidV7Generator } from 'src/shared/infrastructure/providers/uuidGenerator.provider';

@Module({
  controllers: [ProducerController],
  providers: [
    CreateProducerUseCase,
    UpdateProducerUseCase,
    DeleteProducerUseCase,
    FindByIdProducerUseCase,
    { provide: ProducerContract, useClass: ProducerRepository },
    { provide: EventEmitterContract, useClass: EventEmitterProvider },
    { provide: IdGeneratorContract, useClass: UuidV7Generator },
  ],
})
export class ProducerModule {}
