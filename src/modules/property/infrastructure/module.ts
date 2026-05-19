import { Module } from '@nestjs/common';
import { PropertyContract } from '../domain/repositories/property-repository.interface';
import { PropertyRepository } from './persistence/repository';
import { PropertyController } from '../presentation/controller';
import { CreatePropertyUseCase } from '../application/use-cases/create-property.service';
import { FindBySlugUseCase } from '../application/use-cases/find-property-by-slug.service';
import { DeletePropertyUseCase } from '../application/use-cases/delete-property.service';
import { UpdateProducerUseCase } from 'src/modules/producer/application/use-cases/update-producer';

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
