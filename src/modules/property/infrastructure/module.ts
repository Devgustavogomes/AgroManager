import { Module } from '@nestjs/common';
import { PropertyContract } from '../domain/repositories/property-repository.interface';
import { PropertyRepository } from './persistence/repository';
import { PropertyController } from '../presentation/controller';
import { CreatePropertyUseCase } from '../application/use-cases/create-property.service';
import { FindBySlugUseCase } from '../application/use-cases/find-property-by-slug.service';

@Module({
  controllers: [PropertyController],
  providers: [
    { provide: PropertyContract, useClass: PropertyRepository },
    CreatePropertyUseCase,
    FindBySlugUseCase,
  ],
})
export class PropertyModule {}
