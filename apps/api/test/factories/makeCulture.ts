import { randomUUID } from 'crypto';
import {
  Culture,
  CultureProps,
} from '../../src/modules/culture/domain/entities/culture.entity';
import { Area } from '../../src/shared/domain/value-objects/area';

type Override = Partial<CultureProps>;

export function makeFakeCulture(override: Override = {}) {
  return Culture.create({
    cultureId: randomUUID(),
    name: 'Soja',
    allocatedArea: Area.create(50),
    propertyId: randomUUID(),
    ...override,
  });
}
