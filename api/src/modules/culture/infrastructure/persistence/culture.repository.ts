import { Injectable } from '@nestjs/common';

import { DatabaseService } from 'src/infra/database/service';
import { Culture } from '../../domain/entities/culture.entity';
import { CultureMapper } from '../culture.mapper';
import {
  CultureContract,
  CulturePersistence,
} from '../../domain/repositories/culture.repository.interface';
import { PoolClient } from 'pg';

@Injectable()
export class CultureRepository implements CultureContract {
  constructor(private readonly databaseService: DatabaseService) {}

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
                name = COALESCE($1, name),
               "allocatedArea" = COALESCE($2,"allocatedArea")
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
    const sql = `SELECT SUM("allocatedArea") as sum
                FROM crops
                WHERE "cultureId" = $1
                FOR UPDATE`;

    const params = [id];

    const result = await this.databaseService.query<{ sum: number }>(
      sql,
      params,
      client,
    );

    return result[0].sum;
  }

  async isOwner(producerId: string, cultureId: string): Promise<boolean> {
    const sql = `SELECT EXISTS (
                    SELECT 1
                    FROM cultures AS cult
                    INNER JOIN properties AS prop 
                        ON cult."propertyId" = prop."propertyId"
                    WHERE cult."cultureId" = $1
                    AND prop."producerId" = $2
                    FOR UPDATE
                ) AS hasProperty`;

    const params = [cultureId, producerId];

    const result = await this.databaseService.query<{ hasProperty: boolean }>(
      sql,
      params,
    );

    return result[0].hasProperty;
  }
}
