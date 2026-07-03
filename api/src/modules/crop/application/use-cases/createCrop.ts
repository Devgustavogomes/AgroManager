import { Injectable } from '@nestjs/common';
import { CropContract } from '../../domain/repositories/cropsRepository.contract';
import { CreateCropInput } from '../dto/createCrop.dto';
import { DatabaseContract } from '@agromanager/infra/database/contract';
import { Crop } from '../../domain/entities/crop.entity';
import { Area } from 'src/shared/domain/value-objects/area';
import { CropMapper } from '../../infrastructure/crop.mapper';
import { ValidateCultureCropsAreaService } from 'src/modules/culture/domain/services/validateCultureCropsArea.service';

@Injectable()
export class CreateCropUseCase {
  constructor(
    private readonly repository: CropContract,
    private readonly databaseService: DatabaseContract,
  ) {}

  async execute(cultureId: string, dto: CreateCropInput) {
    const allocatedArea = Area.create(dto.allocatedArea);

    const plantingDate = new Date(dto.plantingDate);

    const harvestDateExpected = new Date(dto.harvestDateExpected);

    const harvestDateActual = dto.harvestDateActual
      ? new Date(dto.harvestDateActual)
      : null;

    const crop = Crop.create({
      ...dto,
      cultureId,
      allocatedArea,
      plantingDate,
      harvestDateExpected,
      harvestDateActual,
    });

    return await this.databaseService.transaction(async (client) => {
      const cultureArea = await this.repository.getCultureArea(
        crop.cultureId,
        client,
      );

      const cropsArea = await this.repository.getCropsArea(cultureId, client);

      ValidateCultureCropsAreaService.execute(
        Area.create(cultureArea),
        Area.create(cropsArea).sum(crop.allocatedArea),
      );

      const result = await this.repository.create(crop, client);

      return CropMapper.toResponse([result])[0];
    });
  }
}
