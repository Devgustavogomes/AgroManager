import {
  CreatePropertyInputDto,
  PropertyOutputDto,
  UpdatePropertyInputDto,
} from './dto';
import { PoolClient } from 'pg';

export abstract class PropertyContract {
  abstract findById(id: string): Promise<PropertyOutputDto | undefined>;

  abstract create(
    id: string,
    dto: CreatePropertyInputDto,
    totalArea: number,
    client: PoolClient,
  ): Promise<PropertyOutputDto>;

  abstract update(
    id: string,
    dto: UpdatePropertyInputDto,
    totalArea: number | undefined,
  ): Promise<PropertyOutputDto>;

  abstract delete(id: string): Promise<void>;

  abstract isOwner(
    idProducer: string,
    idService: string,
  ): Promise<{ id_property: string } | undefined>;

  abstract count(id: string, client: PoolClient): Promise<number>;
}
