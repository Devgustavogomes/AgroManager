import { Culture } from '../entities/culture.entity';
import { Area } from 'src/shared/domain/value-objects/area';

export interface CulturePersistence {
  cultureId: string;
  propertyId: string;
  name: string;
  allocatedArea: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export abstract class CultureContract {
  abstract findById(id: string, client?: unknown): Promise<Culture>;

  abstract create(culture: Culture, client: unknown): Promise<Culture>;

  abstract update(culture: Culture, client?: unknown): Promise<Culture>;

  abstract delete(id: string): Promise<void>;

  abstract cropSum(id: string, client?: unknown): Promise<number>;

  abstract cultureAreaSum(id: string, client: unknown): Promise<Area>;

  abstract getPropertyArea(slug: string, client: unknown): Promise<Area>;

  abstract findPropertyBySlug(slug: string, client: unknown): Promise<string>;

  abstract isOwner(producerId: string, cultureId: string): Promise<boolean>;
}
