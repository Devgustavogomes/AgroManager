import { DatabaseService } from '@agromanager/infra/database/service';
import { Injectable } from '@nestjs/common';
import { PoolClient } from 'pg';
import {
  PropertyContract,
  PropertyPersistence,
} from '../../domain/repositories/property-repository.interface';
import { PropertyEntity } from '../../domain/entities/property.entity';
import { PropertyMapper } from './property.mapper';

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
    slug: string,
    producerId: string,
    property: PropertyEntity,
  ): Promise<PropertyEntity> {
    const sql = `UPDATE properties
                SET
                "name" = COALESCE($1, "name"),
                "city" = COALESCE($2, "city"),
                "state" = COALESCE($3, "state"),
                "arableArea" = COALESCE($4, "arableArea"),
                "vegetationArea" = COALESCE($5, "vegetationArea"),
                "totalArea" = COALESCE($6, "totalArea"),
                "updatedAt" = $7
                WHERE "slug" = $8
                AND "producerId" = $9
                RETURNING *`;

    const params = [
      property.getName,
      property.getCity,
      property.getState,
      property.getArableArea,
      property.getVegetationArea,
      property.getTotalArea,
      property.getUpdatedAt,
      slug,
      producerId,
    ];

    const result = await this.databaseservice.query<PropertyPersistence>(
      sql,
      params,
    );

    return PropertyMapper.toDomain(result)[0];
  }

  async delete(slug: string, producerId: string) {
    const sql = `DELETE FROM properties
              WHERE "slug" = $1
              AND "producerId" = $2`;

    const params = [slug, producerId];

    await this.databaseservice.query(sql, params);
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

  async isOwner(producerId: string, propertyId: string): Promise<boolean> {
    const sql = `SELECT EXISTS (
      SELECT 1
      FROM properties
      WHERE "producerId" = $1
      AND "propertyId" = $2
    ) AS "hasProperty";`;
    const params = [producerId, propertyId];

    const result = await this.databaseservice.query<{ hasProperty: boolean }>(
      sql,
      params,
    );

    return result[0].hasProperty;
  }
}
