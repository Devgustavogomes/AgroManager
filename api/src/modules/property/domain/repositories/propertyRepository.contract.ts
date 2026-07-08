import { Property } from '../entities/property.entity';

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
  ): Promise<Property | undefined>;

  abstract create(property: Property, client: unknown): Promise<Property>;

  abstract update(producerId: string, property: Property): Promise<Property>;

  abstract delete(slug: string, producerId: string): Promise<void>;

  abstract isOwner(producerId: string, propertyId: string): Promise<boolean>;

  abstract count(property: Property, client: unknown): Promise<number>;
}
