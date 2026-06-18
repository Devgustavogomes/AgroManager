import { Area } from 'src/shared/domain/value-object/area';
import { CultureOutput } from '../application/dto/cultureOutput.dto';
import { Culture } from '../domain/entities/culture.entity';
import { CulturePersistence } from '../domain/repositories/culture.repository.interface';

export class CultureMapper {
  static toDomain(data: CulturePersistence[]): Culture[] {
    return data
      .values()
      .map((r) =>
        Culture.create({
          cultureId: r.cultureId,
          propertyId: r.propertyId,
          name: r.name,
          allocatedArea: Area.create(Number(r.allocatedArea)),
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
        }),
      )
      .toArray();
  }

  static toResponse(data: Culture[]): CultureOutput[] {
    return data
      .values()
      .map((r) => ({
        cultureId: r.cultureId,
        propertyId: r.propertyId,
        name: r.name,
        allocatedArea: r.allocatedArea.getValue,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt ? r.updatedAt.toISOString() : null,
      }))
      .toArray();
  }
}
