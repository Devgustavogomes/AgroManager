import { Injectable } from '@nestjs/common';
import { PropertyContract } from '../../domain/repositories/propertyRepository.contract';
import { UpdatePropertyDto } from '../dto/update.dto';
import { Slug } from '../../domain/value-object/slug';
import { Area } from 'src/shared/domain/value-objects/area';
import { NotFoundError } from 'src/shared/domain/errors/notFoundError';

@Injectable()
export class UpdatePropertyUseCase {
  constructor(private readonly propertyRepository: PropertyContract) {}

  async execute(slug: string, producerId: string, dto: UpdatePropertyDto) {
    const property = await this.propertyRepository.findBySlug(slug, producerId);

    if (!property) {
      throw new NotFoundError('Property not found');
    }

    property.update({
      name: dto.name,
      city: dto.city,
      state: dto.state,
      slug: dto.slug ? Slug.createFromText(dto.slug) : undefined,
      totalArea:
        dto.totalArea !== undefined ? Area.create(dto.totalArea) : undefined,
      arableArea:
        dto.arableArea !== undefined ? Area.create(dto.arableArea) : undefined,
      vegetationArea:
        dto.vegetationArea !== undefined
          ? Area.create(dto.vegetationArea)
          : undefined,
    });

    return await this.propertyRepository.update(slug, producerId, property);
  }
}
