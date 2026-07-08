import { PropertyMapper } from '../../infrastructure/persistence/property.mapper';
import { DatabaseContract } from '@agromanager/infra/database/contract';
import { Property } from '../../domain/entities/property.entity';
import { Area } from '../../../../shared/domain/value-objects/area';
import { Slug } from '../../domain/value-object/slug';
import { CreatePropertyDto } from '../dto/create.dto';
import { Injectable } from '@nestjs/common';
import { PropertyOutputDto } from '../dto/output.dto';
import { PropertyContract } from '../../domain/repositories/propertyRepository.contract';
import { ValidateMaxProperties } from '../../domain/services/validateMaxProperties.service';
import { EventEmitterContract } from 'src/shared/domain/providers/emitterProvider.contract';

@Injectable()
export class CreatePropertyUseCase {
  constructor(
    private propertyRepository: PropertyContract,
    private dbService: DatabaseContract,
    private eventEmitter: EventEmitterContract,
  ) {}

  async execute(
    producerId: string,
    dto: CreatePropertyDto,
  ): Promise<PropertyOutputDto> {
    const totalArea = Area.create(dto.totalArea);

    const arableArea = Area.create(dto.arableArea ?? 0);

    const vegetationArea = Area.create(dto.vegetationArea ?? 0);

    const slug = dto.slug
      ? Slug.createFromText(dto.slug)
      : Slug.createFromText(dto.name);

    const property = Property.create({
      ...dto,
      producerId,
      slug,
      totalArea,
      arableArea,
      vegetationArea,
    });

    const result = await this.dbService.transaction(async (client) => {
      const propertiesCount = await this.propertyRepository.count(
        property,
        client,
      );

      ValidateMaxProperties.execute(propertiesCount);

      return await this.propertyRepository.create(property, client);
    });

    property.getDomainEvents(producerId).forEach((event) => {
      this.eventEmitter.emit(event);
    });

    property.clearDomainEvents();

    return PropertyMapper.toResponse(result);
  }
}
