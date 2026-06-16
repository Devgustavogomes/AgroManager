import { PoolClient } from 'pg';
import { CropOutput } from '../../application/dto/cropOutput.dto';
import { UpdateCropInput } from '../../application/dto/updateCrop.dto';
import { Crop } from '../entities/crop.entity';
import { CropStatus } from '../constants/crop-status.enum';
import { PestStatus } from '../constants/pest-status.enum';

export interface CropPersistence {
  cropId: string;
  cultureId: string;
  name: string;
  status: CropStatus;
  allocatedArea: number;
  plantingDate: string;
  harvestDateExpected: string;
  harvestDateActual: string | null;
  pestStatus: PestStatus;
  createdAt: string;
  updatedAt: string | null;
}

export abstract class CropContract {
  abstract findById(id: string, client?: PoolClient): Promise<Crop>;
  abstract findByCulture(idCulture: string): Promise<Crop[]>;
  abstract create(crop: Crop, cliente: PoolClient): Promise<Crop>;
  abstract update(crop: Crop, client: PoolClient): Promise<Crop>;
  abstract deleteById(id: string): Promise<void>;
  abstract deleteByCulture(idCulture: string): Promise<void>;
  abstract getCultureArea(
    idCulture: string,
    client: PoolClient,
  ): Promise<number>;
  abstract isOwner(producerId: string, cropId: string): Promise<boolean>;
}
