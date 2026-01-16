import { DatabaseService } from 'src/infra/database/database.service';
import { Injectable } from '@nestjs/common';
import { propertyMapper } from './mapper';
import {
  CreatePropertyInputDto,
  PropertyOutputDto,
  UpdatePropertyInputDto,
} from './dto';
import { PoolClient } from 'pg';
import { PropertyContract } from './contract';

export interface PropertyPersistence {
  id_property: string;
  id_producer: string;
  name: string;
  city: string;
  state: string;
  total_area: number;
  arable_area: number;
  vegetation_area: number;
  created_at: Date;
  updated_at: Date | null;
}

@Injectable()
export class PropertyRepository implements PropertyContract {
  constructor(private readonly databaseservice: DatabaseService) {}

  async findById(id: string): Promise<PropertyOutputDto | undefined> {
    const sql = `SELECT 
                  *
                FROM properties
                WHERE id_property = $1`;

    const params = [id];

    const property = await this.databaseservice.query<PropertyPersistence>(
      sql,
      params,
    );

    return propertyMapper(property)[0];
  }

  async create(
    id: string,
    dto: CreatePropertyInputDto,
    totalArea: number,
    client: PoolClient,
  ): Promise<PropertyOutputDto> {
    const sql = `INSERT INTO properties (
      ID_PRODUCER,
      NAME,
      CITY,
      STATE,
      ARABLE_AREA,
      VEGETATION_AREA,
      TOTAL_AREA
    ) VALUES (
      $1,
      $2,
      $3,
      $4,
      $5,
      $6,
      $7
    ) RETURNING *`;

    const params = [
      id,
      dto.name,
      dto.city,
      dto.state,
      dto.arableArea,
      dto.vegetationArea,
      totalArea,
    ];

    const property = await this.databaseservice.query<PropertyPersistence>(
      sql,
      params,
      client,
    );

    return propertyMapper(property)[0];
  }

  async update(
    id: string,
    dto: UpdatePropertyInputDto,
    totalArea: number | undefined,
  ): Promise<PropertyOutputDto> {
    const sql = `UPDATE properties
                SET
                NAME = COALESCE($1, NAME),
                CITY = COALESCE($2, CITY),
                STATE = COALESCE($3, STATE),
                ARABLE_AREA = COALESCE($4, ARABLE_AREA),
                VEGETATION_AREA = COALESCE($5, VEGETATION_AREA),
                TOTAL_AREA = COALESCE($6, TOTAL_AREA),
                UPDATED_AT = NOW()
                WHERE id_property = $7
                RETURNING *`;

    const params = [
      dto.name ?? null,
      dto.city ?? null,
      dto.state ?? null,
      dto.arableArea ?? null,
      dto.vegetationArea ?? null,
      totalArea ?? null,
      id,
    ];

    const property = await this.databaseservice.query<PropertyPersistence>(
      sql,
      params,
    );

    return propertyMapper(property)[0];
  }

  async delete(id: string) {
    const sql = `DELETE FROM properties
              WHERE id_property = $1`;

    const params = [id];

    await this.databaseservice.query(sql, params);
  }

  async isOwner(
    idProducer: string,
    idService: string,
  ): Promise<{ id_property: string } | undefined> {
    const sql = `SELECT id_property
                FROM properties
                WHERE id_producer = $1
                AND id_property = $2`;

    const params = [idProducer, idService];

    const id = await this.databaseservice.query<
      | {
          id_property: string;
        }
      | undefined
    >(sql, params);

    return id[0];
  }

  async count(id: string, client: PoolClient): Promise<number> {
    const sql = `SELECT COUNT(*) AS TOTAL
                FROM properties
                WHERE id_producer = $1`;

    const params = [id];

    const result = await this.databaseservice.query<{ total: number }>(
      sql,
      params,
      client,
    );

    return result[0].total;
  }
}
