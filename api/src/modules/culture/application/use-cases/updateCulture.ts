import { Injectable } from '@nestjs/common';
import { CultureContract } from '../../domain/repositories/cultureRepository.interface';
import { UpdateCultureInput } from '../dto/updateCulture.dto';
import { CultureOutput } from '../dto/cultureOutput.dto';
import { CultureMapper } from '../../infrastructure/culture.mapper';
import { DatabaseContract } from '@agromanager/infra/database/contract';
import { Area } from 'src/shared/domain/value-object/area';
import { ValidateCultureCropsAreaService } from '../../domain/services/validateCultureCropsArea.service';
import { NotFoundError } from 'src/shared/domain/errors/notFoundError';

@Injectable()
export class UpdateCultureUseCase {
  constructor(
    private readonly cultureRepository: CultureContract,
    private readonly databaseService: DatabaseContract,
  ) {}

  async execute(id: string, dto: UpdateCultureInput): Promise<CultureOutput> {
    return await this.databaseService.transaction(async (client) => {
      const culture = await this.cultureRepository.findById(id, client);

      if (!culture) {
        throw new NotFoundError('Culture not found');
      }

      culture.update({
        name: dto.name,
        allocatedArea: dto.allocatedArea
          ? Area.create(dto.allocatedArea)
          : undefined,
      });

      const sumCrops = await this.cultureRepository.cropSum(id, client);

      ValidateCultureCropsAreaService.execute(
        culture.allocatedArea,
        Area.create(sumCrops),
      );

      const result = await this.cultureRepository.update(culture, client);

      return CultureMapper.toResponse([result])[0];
    });
  }
}
