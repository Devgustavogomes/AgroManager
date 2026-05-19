import { DatabaseService } from 'src/infra/database/service';
import { Injectable } from '@nestjs/common';
import { PoolClient } from 'pg';
import { UpdatePropertyDto } from '../../application/dtos/update.dto';
import {
  PropertyContract,
  PropertyPersistence,
} from '../../domain/repositories/property-repository.interface';
import { PropertyEntity } from '../../domain/entities/property.entity';
import { PropertyMapper } from './mapper';

@Injectable()
export class PropertyRepository implements PropertyContract {
  constructor(private readonly databaseservice: DatabaseService) {}

  async findBySlug(
    slug: string,
    producerId: string,
  ): Promise<PropertyEntity | undefined> {
    const sql = `SELECT 
                  *
                FROM properties
                WHERE "slug" = $1
                AND "producerId" = $2`;

    const params = [slug, producerId];

    const property = await this.databaseservice.query<PropertyPersistence>(
      sql,
      params,
    );

    return PropertyMapper.toDomain(property)[0];
  }

  async create(
    property: PropertyEntity,
    client: PoolClient,
  ): Promise<PropertyEntity> {
    const sql = `INSERT INTO properties (
      "producerId",
      "name",
      "city",
      "state",
      "arableArea",
      "vegetationArea",
      "totalArea"
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
      property.getProducerId,
      property.getName,
      property.getCity,
      property.getState,
      property.getArableArea,
      property.getVegetationArea,
      property.getTotalArea,
    ];

    const result = await this.databaseservice.query<PropertyPersistence>(
      sql,
      params,
      client,
    );

    return PropertyMapper.toDomain(result)[0];
  }

  async update(
    id: string,
    dto: UpdatePropertyDto,
    totalArea: number | undefined,
  ): Promise<PropertyEntity> {
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

    return PropertyMapper.toDomain(property)[0];
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

  async count(property: PropertyEntity, client: PoolClient): Promise<number> {
    const sql = `SELECT COUNT(*) AS TOTAL
                FROM properties
                WHERE "producerId" = $1`;

    const params = [property.getProducerId];

    const result = await this.databaseservice.query<{ total: number }>(
      sql,
      params,
      client,
    );

    return result[0].total;
  }
}
