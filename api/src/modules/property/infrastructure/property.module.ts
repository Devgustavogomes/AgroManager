import { Module } from '@nestjs/common';
import { PropertyContract } from '../domain/repositories/propertyRepository.contract';
import { PropertyRepository } from './persistence/property.repository';
import { CreatePropertyUseCase } from '../application/use-cases/createProperty';
import { FindBySlugUseCase } from '../application/use-cases/findPropertyBySlug';
import { FindAllPropertiesUseCase } from '../application/use-cases/findAllProperties';
import { DeletePropertyUseCase } from '../application/use-cases/deleteProperty';
import { PropertyController } from '../presentation/property.controller';
import { UpdatePropertyUseCase } from '../application/use-cases/updateProperty';
import { IsPropertyOwnerUseCase } from '../application/use-cases/isPropertyOwner';
import { EventEmitterContract } from 'src/shared/domain/providers/emitterProvider.contract';
import { EventEmitterProvider } from 'src/shared/infrastructure/providers/socketEmitter.provider';
import { IdGeneratorContract } from 'src/shared/domain/providers/idGenerator.contract';
import { UuidV7Generator } from 'src/shared/infrastructure/providers/uuidGenerator.provider';

@Module({
  controllers: [PropertyController],
  providers: [
    { provide: PropertyContract, useClass: PropertyRepository },
    CreatePropertyUseCase,
    FindBySlugUseCase,
    FindAllPropertiesUseCase,
    DeletePropertyUseCase,
    UpdatePropertyUseCase,
    IsPropertyOwnerUseCase,
    { provide: EventEmitterContract, useClass: EventEmitterProvider },
    { provide: IdGeneratorContract, useClass: UuidV7Generator },
  ],
})
export class PropertyModule {}
