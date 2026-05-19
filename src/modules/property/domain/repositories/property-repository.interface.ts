import { PoolClient } from 'pg';
import { UpdatePropertyDto } from '../../application/dtos/update.dto';
import { PropertyEntity } from '../entities/property.entity';

export interface PropertyPersistence {
  propertyId: string;
  producerId: string;
  name: string;
  slug: string;
  city: string;
  state: string;
  totalArea: number;
  arableArea: number;
  vegetationArea: number;
  createdAt: Date;
  updatedAt: Date | null;
}

export abstract class PropertyContract {
  abstract findBySlug(
    slug: string,
    producerId: string,
  ): Promise<PropertyEntity | undefined>;

  abstract create(
    property: PropertyEntity,
    client: PoolClient,
  ): Promise<PropertyEntity>;

  abstract update(
    id: string,
    dto: UpdatePropertyDto,
    totalArea: number | undefined,
  ): Promise<PropertyEntity>;

  abstract delete(slug: string, producerId: string): Promise<void>;

  abstract count(property: PropertyEntity, client: PoolClient): Promise<number>;
}
