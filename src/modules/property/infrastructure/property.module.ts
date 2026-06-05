import { Module } from '@nestjs/common';
import { PropertyContract } from '../domain/repositories/property-repository.interface';
import { PropertyRepository } from './persistence/property.repository';
import { CreatePropertyUseCase } from '../application/use-cases/create-property';
import { FindBySlugUseCase } from '../application/use-cases/find-property-by-slug';
import { DeletePropertyUseCase } from '../application/use-cases/delete-property';
import { UpdateProducerUseCase } from 'src/modules/producer/application/use-cases/update-producer';
import { PropertyController } from '../presentation/property.controller';

@Module({
  controllers: [PropertyController],
  providers: [
    { provide: PropertyContract, useClass: PropertyRepository },
    CreatePropertyUseCase,
    FindBySlugUseCase,
    DeletePropertyUseCase,
    UpdateProducerUseCase,
  ],
})
export class PropertyModule {}
