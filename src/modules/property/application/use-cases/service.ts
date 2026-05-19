import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { DatabaseService } from 'src/infra/database/service';
import { PoolClient } from 'pg';
import { MAX_PROPERTIES } from 'src/config/constants';
import { PropertyContract } from './contract';
import { Area } from 'src/shared/value-object/Area';
import { PropertyOutputDto } from '../dtos/output.dto';
import { CreatePropertyDto } from '../dtos/create.dto';
import { UpdatePropertyDto } from '../dtos/update.dto';

@Injectable()
export class PropertyService {
  constructor(
    private readonly propertyRepository: PropertyContract,
    private readonly db: DatabaseService,
  ) {}
  async update(id: string, dto: UpdatePropertyDto) {
    if (
      (dto.arableArea && !dto.vegetationArea) ||
      (!dto.arableArea && dto.vegetationArea)
    ) {
      throw new UnprocessableEntityException(
        'arable area and vegetation area must be provided together',
      );
    }

    const { totalArea, arableArea, vegetationArea } =
      dto.arableArea && dto.vegetationArea
        ? this.normalizeAreas(dto.arableArea, dto.vegetationArea)
        : {};

    const parsedDto = {
      ...dto,
      arableArea,
      vegetationArea,
    };

    return await this.propertyRepository.update(id, parsedDto, totalArea);
  }

  async delete(id: string) {
    await this.propertyRepository.delete(id);
  }

  async isOwner(idProducer: string, idService: string): Promise<boolean> {
    const result = await this.propertyRepository.isOwner(idProducer, idService);

    if (!result) {
      throw new ForbiddenException(`You don't own this resource`);
    }

    const isOwner = result.id_property === idService;

    return isOwner;
  }
}
