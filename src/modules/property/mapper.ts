import { PropertyOutputDto } from './dto';
import { PropertyPersistence } from './repository';

export function propertyMapper(
  data: PropertyPersistence[],
): PropertyOutputDto[] {
  return data.map((r) => ({
    idProperty: r.id_property,
    idProducer: r.id_producer,
    name: r.name,
    city: r.city,
    state: r.state,
    totalArea: r.total_area / 100,
    arableArea: r.arable_area / 100,
    vegetationArea: r.vegetation_area / 100,
    createdAt: r.created_at.toISOString(),
    updatedAt: r.updated_at ? r.updated_at.toISOString() : null,
  }));
}
