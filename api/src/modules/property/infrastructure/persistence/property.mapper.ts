import { PropertyOutputDto } from '../../application/dtos/output.dto';
import { Property } from '../../domain/entities/property.entity';
import { PropertyPersistence } from '../../domain/repositories/propertyRepository.contract';
import { Area } from '../../../../shared/domain/value-object/area';
import { Slug } from '../../domain/value-object/slug';

export class PropertyMapper {
  static toDomain(data: PropertyPersistence[]): Property[] {
    return data.map((r) =>
      Property.create({
        ...r,
        slug: Slug.createFromText(r.slug),
        totalArea: Area.create(Number(r.totalArea)),
        arableArea: Area.create(Number(r.arableArea)),
        vegetationArea: Area.create(Number(r.vegetationArea)),
        createdAt: r.createdAt,
        updatedAt: r.updatedAt ? r.updatedAt : null,
      }),
    );
  }

  static toResponse(entity: Property): PropertyOutputDto {
    return {
      propertyId: entity.getPropertyId ?? 'non-registered',
      producerId: entity.getProducerId,
      name: entity.getName,
      slug: entity.getSlug,
      city: entity.getCity,
      state: entity.getState,
      totalArea: entity.getTotalArea,
      arableArea: entity.getArableArea,
      vegetationArea: entity.getVegetationArea,
      createdAt: entity.getCreatedAt.toISOString(),
      updatedAt: entity.getUpdatedAt ? entity.getUpdatedAt.toISOString() : null,
    };
  }
}
