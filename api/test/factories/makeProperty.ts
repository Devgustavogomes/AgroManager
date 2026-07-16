import { randomUUID } from 'crypto';
import {
  Property,
  PropertyProps,
} from '../../src/modules/property/domain/entities/property.entity';
import { Area } from '../../src/shared/domain/value-objects/area';

type Override = Partial<PropertyProps>;

export function makeFakeProperty(override: Override = {}) {
  return Property.create({
    producerId: randomUUID(),
    name: 'Fazenda Feliz',
    city: 'São Paulo',
    state: 'SP',
    totalArea: Area.create(100),
    arableArea: Area.create(50),
    vegetationArea: Area.create(50),
    ...override,
  });
}
