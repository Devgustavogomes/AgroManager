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
}
