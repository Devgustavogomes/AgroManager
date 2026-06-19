import { PoolClient } from 'pg';
import { Culture } from '../entities/culture.entity';
import { Area } from 'src/shared/domain/value-object/area';

export interface CulturePersistence {
  cultureId: string;
  propertyId: string;
  name: string;
  allocatedArea: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export abstract class CultureContract {
  abstract findById(id: string, client?: PoolClient): Promise<Culture>;

  abstract create(culture: Culture, client: PoolClient): Promise<Culture>;

  abstract update(culture: Culture, client?: PoolClient): Promise<Culture>;

  abstract delete(id: string): Promise<void>;

  abstract cropSum(id: string, client?: PoolClient): Promise<number>;

  abstract cultureAreaSum(id: string, client: PoolClient): Promise<Area>;

  abstract getPropertyArea(slug: string, client: PoolClient): Promise<Area>;

  abstract isOwner(producerId: string, cultureId: string): Promise<boolean>;
}
