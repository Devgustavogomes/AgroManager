import { Injectable } from '@nestjs/common';

import { DatabaseContract } from '@agromanager/infra/database/contract';
import { Culture } from '../../domain/entities/culture.entity';
import { CultureMapper } from '../culture.mapper';
import {
  CultureContract,
  CulturePersistence,
} from '../../domain/repositories/cultureRepository.contract';
import { PoolClient } from 'pg';
import { Area } from 'src/shared/domain/value-objects/area';

@Injectable()
export class CultureRepository implements CultureContract {
  constructor(private readonly databaseService: DatabaseContract) {}

  async findById(id: string, client?: PoolClient): Promise<Culture> {
    const sql = `SELECT *
                FROM cultures
                WHERE "cultureId" = $1
                ${client ? 'FOR UPDATE' : ''}`;

    const params = [id];

    const result = await this.databaseService.query<CulturePersistence>(
      sql,
      params,
      client,
    );

    return CultureMapper.toDomain(result)[0];
  }

  async findPropertyBySlug(slug: string, client: PoolClient): Promise<string> {
    const sql = `SELECT "propertyId"
                FROM properties
                WHERE slug = $1
                FOR UPDATE`;

    const params = [slug];

    const result = await this.databaseService.query<{ propertyId: string }>(
      sql,
      params,
      client,
    );

    return result[0].propertyId;
  }

  async create(culture: Culture): Promise<Culture> {
    const sql = `INSERT INTO cultures (
                    "propertyId",
                    name,
                   "allocatedArea"
                ) VALUES (
                    $1,
                    $2,
                    $3
                ) 
                RETURNING *`;

    const params = [culture.propertyId, culture.name, culture.allocatedArea];

    const result = await this.databaseService.query<CulturePersistence>(
      sql,
      params,
    );

    return CultureMapper.toDomain(result)[0];
  }

  async update(culture: Culture, client?: PoolClient): Promise<Culture> {
    const sql = `UPDATE cultures
                SET
                name = $1,
               "allocatedArea" = $2
                WHERE "cultureId" = $3
                RETURNING *`;

    const params = [culture.name, culture.allocatedArea, culture.cultureId];

    const result = await this.databaseService.query<CulturePersistence>(
      sql,
      params,
      client,
    );

    return CultureMapper.toDomain(result)[0];
  }

  async delete(id: string): Promise<void> {
    const sql = `DELETE FROM cultures
                WHERE "cultureId" = $1`;

    const params = [id];

    await this.databaseService.query(sql, params);
  }

  async cropSum(id: string, client?: PoolClient): Promise<number> {
    const sql = `SELECT COALESCE(SUM("allocatedArea"), 0) AS "cropsArea"
                FROM crops
                WHERE "cultureId" = $1
                FOR UPDATE`;

    const params = [id];

    const result = await this.databaseService.query<{ cropsArea: string }>(
      sql,
      params,
      client,
    );

    return Number(result[0].cropsArea);
  }

  async getPropertyArea(slug: string, client: PoolClient): Promise<Area> {
    const sql = `SELECT "totalArea"
                FROM properties
                WHERE slug = $1
                FOR UPDATE`;

    const params = [slug];

    const result = await this.databaseService.query<{
      totalArea: string;
    }>(sql, params, client);

    return Area.create(Number(result[0].totalArea));
  }

  async cultureAreaSum(propertyId: string, client: PoolClient): Promise<Area> {
    const sql = `SELECT COALESCE(SUM("allocatedArea"), 0) AS "culturesArea"
                FROM cultures
                WHERE "propertyId" = $1
                FOR UPDATE`;

    const params = [propertyId];

    const result = await this.databaseService.query<{ culturesArea: string }>(
      sql,
      params,
      client,
    );

    return Area.create(Number(result[0].culturesArea));
  }

  async isOwner(producerId: string, cultureId: string): Promise<boolean> {
    const sql = `SELECT EXISTS (
                    SELECT 1
                    FROM cultures AS cult
                    INNER JOIN properties AS prop 
                        ON cult."propertyId" = prop."propertyId"
                    WHERE cult."cultureId" = $1
                    AND prop."producerId" = $2
                ) AS hasProperty`;

    const params = [cultureId, producerId];

    const result = await this.databaseService.query<{ hasProperty: boolean }>(
      sql,
      params,
    );

    return result[0].hasProperty;
  }
}
