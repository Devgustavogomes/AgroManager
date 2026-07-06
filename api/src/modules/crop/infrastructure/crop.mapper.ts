import { Area } from 'src/shared/domain/value-objects/area';
import { Crop } from '../domain/entities/crop.entity';
import { CropPersistence } from '../domain/repositories/cropsRepository.contract';
import { CropOutput } from '../application/dto/cropOutput.dto';

export class CropMapper {
  static toDomain(data: CropPersistence[]): Crop[] {
    return data
      .values()
      .map((r) =>
        Crop.create({
          cropId: r.cropId,
          cultureId: r.cultureId,
          name: r.name,
          status: r.status,
          allocatedArea: Area.create(r.allocatedArea),
          plantingDate: new Date(r.plantingDate),
          harvestDateExpected: new Date(r.harvestDateExpected),
          harvestDateActual: r.harvestDateActual
            ? new Date(r.harvestDateActual)
            : null,
          pestStatus: r.pestStatus,
          createdAt: new Date(r.createdAt),
          updatedAt: r.updatedAt ? new Date(r.updatedAt) : null,
        }),
      )
      .toArray();
  }

  static toResponse(data: Crop[]): CropOutput[] {
    return data
      .values()
      .map((r) => ({
        cropId: r.cropId,
        cultureId: r.cultureId,
        name: r.name,
        status: r.status,
        allocatedArea: r.allocatedArea.getValue,
        plantingDate: r.plantingDate.toISOString(),
        harvestDateExpected: r.harvestDateExpected.toISOString(),
        harvestDateActual: r.harvestDateActual?.toISOString() || null,
        pestStatus: r.pestStatus,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt?.toISOString() || null,
      }))
      .toArray();
  }
}
