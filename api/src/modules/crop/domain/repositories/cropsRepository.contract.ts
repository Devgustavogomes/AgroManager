import { Crop } from '../entities/crop.entity';
import { CropStatus } from '../constants/crop-status.enum';
import { PestStatus } from '../constants/pest-status.enum';

export interface CropPersistence {
  cropId: string;
  cultureId: string;
  name: string;
  status: CropStatus;
  allocatedArea: string;
  plantingDate: string;
  harvestDateExpected: string;
  harvestDateActual: string | null;
  pestStatus: PestStatus;
  createdAt: string;
  updatedAt: string | null;
}

export abstract class CropContract {
  abstract findById(id: string, client?: unknown): Promise<Crop>;
  abstract findByCulture(cultureId: string): Promise<Crop[]>;
  abstract create(crop: Crop, cliente: unknown): Promise<Crop>;
  abstract update(crop: Crop, client: unknown): Promise<Crop>;
  abstract deleteById(id: string): Promise<void>;
  abstract deleteByCulture(cultureId: string): Promise<void>;
  abstract getCultureArea(cultureId: string, client: unknown): Promise<number>;
  abstract getCropsArea(cultureId: string, client: unknown): Promise<number>;
  abstract isOwner(producerId: string, cropId: string): Promise<boolean>;
}
