import { CreatePropertyDto, PropertyOutputDto, UpdatePropertyDto } from './dto';
import { PoolClient } from 'pg';

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

export abstract class PropertyContract {
  abstract findById(id: string): Promise<PropertyOutputDto | undefined>;

  abstract create(
    id: string,
    dto: CreatePropertyDto,
    totalArea: number,
    client: PoolClient,
  ): Promise<PropertyOutputDto>;

  abstract update(
    id: string,
    dto: UpdatePropertyDto,
    totalArea: number | undefined,
  ): Promise<PropertyOutputDto>;

  abstract delete(id: string): Promise<void>;

  abstract isOwner(
    idProducer: string,
    idService: string,
  ): Promise<{ id_property: string } | undefined>;

  abstract count(id: string, client: PoolClient): Promise<number>;
}
