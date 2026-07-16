import { Area } from 'src/shared/domain/value-objects/area';
import { CultureOutput } from '../application/dto/cultureOutput.dto';
import { Culture } from '../domain/entities/culture.entity';
import { CulturePersistence } from '../domain/repositories/cultureRepository.contract';

export class CultureMapper {
  static toDomain(data: CulturePersistence[]): Culture[] {
    return data
      .values()
      .map((r) =>
        Culture.reconstitute({
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
        createdAt:
          r.createdAt instanceof Date ? r.createdAt.toISOString() : r.createdAt,
        updatedAt:
          r.updatedAt instanceof Date ? r.updatedAt.toISOString() : null,
      }))
      .toArray();
  }
}
