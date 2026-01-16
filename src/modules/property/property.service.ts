import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PropertyRepository } from './property.repository';
import { PropertyOutputDto } from './dto/propertyOutput.dto';
import {
  CreatePropertyInputDto,
  UpdatePropertyInputDto,
} from './dto/propertyInput.dto';
import { DatabaseService } from 'src/infra/database/database.service';
import { PoolClient } from 'pg';
import { MAX_PROPERTIES } from 'src/config/constants';

@Injectable()
export class PropertyService {
  constructor(
    private readonly propertyRepository: PropertyRepository,
    private readonly db: DatabaseService,
  ) {}

  async findById(id: string): Promise<PropertyOutputDto> {
    const property = await this.propertyRepository.findById(id);

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    return property;
  }

  async create(
    id: string,
    dto: CreatePropertyInputDto,
  ): Promise<PropertyOutputDto> {
    const { arableArea, totalArea, vegetationArea } = this.normalizeAreas(
      dto.arableArea,
      dto.vegetationArea,
    );

    const parsedDto = {
      ...dto,
      arableArea,
      vegetationArea,
    };
    return this.db.transactiontransaction(async (client: PoolClient) => {
      const properties = await this.propertyRepository.count(id, client);

      if (properties > MAX_PROPERTIES) {
        throw new BadRequestException(
          `You have too many properties. The maximum allowed is ${MAX_PROPERTIES}`,
        );
      }
      return await this.propertyRepository.create(
        id,
        parsedDto,
        totalArea,
        client,
      );
    });
  }

  async update(id: string, dto: UpdatePropertyInputDto) {
    if (
      (dto.arableArea && !dto.vegetationArea) ||
      (!dto.arableArea && dto.vegetationArea)
    ) {
      throw new BadRequestException(
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

  normalizeAreas(
    arable: number,
    vegetation: number,
  ): { arableArea: number; vegetationArea: number; totalArea: number } {
    const arableArea = arable * 100;

    const vegetationArea = vegetation * 100;

    return {
      arableArea,
      vegetationArea,
      totalArea: arableArea + vegetationArea,
    };
  }
}
