import { Injectable } from '@nestjs/common';
import { DatabaseContract } from '@agromanager/infra/database/contract';
import {
  CropContract,
  CropPersistence,
} from '../../domain/repositories/cropsRepository.contract';

import { PoolClient } from 'pg';
import { Crop } from '../../domain/entities/crop.entity';
import { CropMapper } from '../crop.mapper';

@Injectable()
export class CropRepository implements CropContract {
  constructor(private readonly databaseService: DatabaseContract) {}

  async findById(id: string, client?: PoolClient): Promise<Crop> {
    const sql = `SELECT *
                FROM crops
                WHERE "cropId" = $1
                ${client ? 'FOR UPDATE' : ''}`;

    const params = [id];

    const result = await this.databaseService.query<CropPersistence>(
      sql,
      params,
      client,
    );

    return CropMapper.toDomain(result)[0];
  }

  async findByCulture(idCulture: string): Promise<Crop[]> {
    const sql = `SELECT *
                   FROM crops
                   WHERE "cultureId" = $1`;

    const params = [idCulture];

    const crops = await this.databaseService.query<CropPersistence>(
      sql,
      params,
    );

    return CropMapper.toDomain(crops);
  }

  async getCultureArea(cultureId: string, client: PoolClient): Promise<number> {
    const sql = `SELECT "allocatedArea" 
                 FROM cultures
                 WHERE "cultureId" = $1
                 FOR UPDATE`;

    const params = [cultureId];

    const result = await this.databaseService.query<number>(
      sql,
      params,
      client,
    );

    return result[0] ?? 0;
  }

  async getCropsArea(cultureId: string, client: PoolClient): Promise<number> {
    const sql = `SELECT SUM("allocatedArea")
                FROM crops
                WHERE "cultureId" = $1
                FOR UPDATE`;

    const params = [cultureId];

    const result = await this.databaseService.query<number>(
      sql,
      params,
      client,
    );

    return result[0] ?? 0;
  }

  async create(crop: Crop, cliente: PoolClient): Promise<Crop> {
    const sql = `INSERT INTO crops (
                "cultureId",
                name,
                status, 
                "allocatedArea", 
                "plantingDate",
                "harvestDateExpected", 
                "harvestDateActual", 
                "pestStatus"
                ) VALUES (
                 $1, 
                 $2, 
                 $3, 
                 $4, 
                 $5, 
                 $6, 
                 $7, 
                 $8)
                RETURNING *
                  `;

    const params = [
      crop.cultureId,
      crop.name,
      crop.status,
      crop.allocatedArea,
      crop.plantingDate,
      crop.harvestDateExpected,
      crop.harvestDateActual,
      crop.pestStatus,
    ];

    const result = await this.databaseService.query<CropPersistence>(
      sql,
      params,
      cliente,
    );

    return CropMapper.toDomain(result)[0];
  }

  async update(crop: Crop, client: PoolClient): Promise<Crop> {
    const sql = `UPDATE crops
                SET 
                name = $1, 
                status = $2, 
                "allocatedArea" = $3, 
                "plantingDate" = $4,
                "harvestDateExpected" = $5, 
                "harvestDateActual" = $6, 
                "pestStatus" = $7
                WHERE "cropId" = $8
                RETURNING *
    `;

    const params = [
      crop.name,
      crop.status,
      crop.allocatedArea,
      crop.plantingDate,
      crop.harvestDateExpected,
      crop.harvestDateActual,
      crop.pestStatus,
      crop.cropId,
    ];

    const result = await this.databaseService.query<CropPersistence>(
      sql,
      params,
      client,
    );

    return CropMapper.toDomain(result)[0];
  }

  async deleteById(id: string): Promise<void> {
    const sql = `DELETE FROM crops
                WHERE "cropId" = $1`;

    const params = [id];

    await this.databaseService.query(sql, params);
  }

  async deleteByCulture(idCulture: string): Promise<void> {
    const sql = `DELETE FROM crops
                WHERE "cultureId" = $1`;

    const params = [idCulture];

    await this.databaseService.query(sql, params);
  }

  async isOwner(producerId: string, cropId: string): Promise<boolean> {
    const sql = `SELECT EXISTS (
                SELECT 1
                FROM crops AS cr
                INNER JOIN cultures AS cult 
                    ON cult."cultureId" = cr."cultureId"
                INNER JOIN properties AS pr 
                    ON pr."propertyId" = cult."propertyId"
                WHERE cr."cropId" = $1
                AND pr."producerId" = $2
            )`;

    const params = [cropId, producerId];

    const result = await this.databaseService.query<boolean>(sql, params);

    return result[0];
  }
}
