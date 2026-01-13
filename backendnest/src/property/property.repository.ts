import { DatabaseService } from 'src/database/database.service';
import { Injectable } from '@nestjs/common';
import { PropertyOutputDto } from './dto/propertyOutput.dto';

interface PropertyPersistence {
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
export class PropertyRepository {
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

    return property.map((r) => ({
      idProperty: r.id_property,
      idProducer: r.id_producer,
      name: r.name,
      city: r.city,
      state: r.state,
      totalArea: r.total_area / 100,
      arableArea: r.arable_area / 100,
      vegetationArea: r.vegetation_area / 100,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }))[0];
  }
}
