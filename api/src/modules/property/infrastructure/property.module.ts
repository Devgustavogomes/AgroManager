import { Module } from '@nestjs/common';
import { PropertyContract } from '../domain/repositories/property-repository.interface';
import { PropertyRepository } from './persistence/property.repository';
import { CreatePropertyUseCase } from '../application/use-cases/create-property';
import { FindBySlugUseCase } from '../application/use-cases/find-property-by-slug';
import { DeletePropertyUseCase } from '../application/use-cases/delete-property';
import { PropertyController } from '../presentation/property.controller';
import { UpdatePropertyUseCase } from '../application/use-cases/update-property';

@Module({
  controllers: [PropertyController],
  providers: [
    { provide: PropertyContract, useClass: PropertyRepository },
    CreatePropertyUseCase,
    FindBySlugUseCase,
    DeletePropertyUseCase,
    UpdatePropertyUseCase,
  ],
})
export class PropertyModule {}
