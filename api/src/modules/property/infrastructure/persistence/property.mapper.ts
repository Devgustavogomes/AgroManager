import { PropertyOutputDto } from '../../application/dto/output.dto';
import { Property } from '../../domain/entities/property.entity';
import { PropertyPersistence } from '../../domain/repositories/propertyRepository.contract';
import { Area } from '../../../../shared/domain/value-objects/area';
import { Slug } from '../../domain/value-object/slug';

export class PropertyMapper {
  static toDomain(data: PropertyPersistence[]): Property[] {
    return data.map((r) =>
      Property.reconstitute({
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
      propertyId: entity.propertyId ?? 'non-registered',
      producerId: entity.producerId,
      name: entity.name,
      slug: entity.slug,
      city: entity.city,
      state: entity.state,
      totalArea: entity.totalArea,
      arableArea: entity.arableArea,
      vegetationArea: entity.vegetationArea,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt ? entity.updatedAt.toISOString() : null,
    };
  }
}
