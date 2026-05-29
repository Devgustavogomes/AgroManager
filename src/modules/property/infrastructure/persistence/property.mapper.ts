import { PropertyOutputDto } from '../../application/dtos/output.dto';
import { PropertyEntity } from '../../domain/entities/property.entity';
import { PropertyPersistence } from '../../domain/repositories/property-repository.interface';
import { Area } from '../../../../shared/domain/value-object/area';
import { Slug } from '../../domain/value-object/slug';

export class PropertyMapper {
  static toDomain(data: PropertyPersistence[]): PropertyEntity[] {
    return data.map((r) =>
      PropertyEntity.create({
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

  static toResponse(entity: PropertyEntity): PropertyOutputDto {
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
