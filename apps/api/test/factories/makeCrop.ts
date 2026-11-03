import { randomUUID } from 'crypto';
import {
  Crop,
  CropProps,
} from '../../src/modules/crop/domain/entities/crop.entity';
import { Area } from '../../src/shared/domain/value-objects/area';
import { CropStatus } from 'src/modules/crop/domain/constants/crop-status.enum';
import { PestStatus } from 'src/modules/crop/domain/constants/pest-status.enum';

type Override = Partial<CropProps>;

export function makeFakeCrop(override: Override = {}) {
  return Crop.create({
    cropId: randomUUID(),
    cultureId: randomUUID(),
    name: 'Safra de Inverno',
    status: CropStatus.PLANNED,
    pestStatus: PestStatus.NONE,
    allocatedArea: Area.create(50),
    plantingDate: new Date(),
    harvestDateExpected: new Date(
      new Date().setMonth(new Date().getMonth() + 6),
    ),
    ...override,
  });
}
