import { PropertyMapper } from '../../infrastructure/persistence/property.mapper';
import { DatabaseContract } from '@agromanager/infra/database/contract';
import { Property } from '../../domain/entities/property.entity';
import { Area } from '../../../../shared/domain/value-object/area';
import { Slug } from '../../domain/value-object/slug';
import { CreatePropertyDto } from '../dto/create.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PoolClient } from 'pg';
import { PropertyOutputDto } from '../dto/output.dto';
import { PropertyContract } from '../../domain/repositories/propertyRepository.contract';
import { MAX_PROPERTIES_PER_PRODUCER } from '../../domain/constants/maxProperties.constant';

@Injectable()
export class CreatePropertyUseCase {
  constructor(
    private propertyRepository: PropertyContract,
    private dbService: DatabaseContract,
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

    const result = await this.dbService.transaction(
      async (client: PoolClient) => {
        const properties = await this.propertyRepository.count(
          property,
          client,
        );

        if (properties >= MAX_PROPERTIES_PER_PRODUCER) {
          throw new BadRequestException(
            `You have too many properties. The maximum allowed is ${MAX_PROPERTIES_PER_PRODUCER}`,
          );
        }

        return await this.propertyRepository.create(property, client);
      },
    );

    return PropertyMapper.toResponse(result);
  }
}
