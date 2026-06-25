import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CropContract } from '../../domain/repositories/cropsRepository.contract';
import { UpdateCropInput } from '../dto/updateCrop.dto';
import { CropOutput } from '../dto/cropOutput.dto';
import { CropMapper } from '../../infrastructure/crop.mapper';
import { DatabaseContract } from '@agromanager/infra/database/contract';
import { Area } from 'src/shared/domain/value-object/area';
import { ValidateCultureCropsAreaService } from 'src/modules/culture/domain/services/validateCultureCropsArea.service';

@Injectable()
export class UpdateCropUseCase {
  constructor(
    private readonly repository: CropContract,
    private readonly databaseService: DatabaseContract,
  ) {}

  async execute(
    cropId: string,
    cultureId: string,
    dto: UpdateCropInput,
  ): Promise<CropOutput> {
    return await this.databaseService.transaction(async (client) => {
      const crop = await this.repository.findById(cropId, client);

      if (!crop) {
        throw new NotFoundException(`Crop not found`);
      }

      crop.update({
        ...dto,
        allocatedArea: dto.allocatedArea
          ? Area.create(dto.allocatedArea)
          : undefined,
        plantingDate: dto.plantingDate ? new Date(dto.plantingDate) : undefined,
        harvestDateExpected: dto.harvestDateExpected
          ? new Date(dto.harvestDateExpected)
          : undefined,
        harvestDateActual: dto.harvestDateActual
          ? new Date(dto.harvestDateActual)
          : undefined,
      });

      const result = await this.databaseService.transaction(async (client) => {
        const [cultureArea, cropsArea] = await Promise.all([
          await this.repository.getCultureArea(cultureId, client),
          await this.repository.getCropsArea(cultureId, client),
        ]);

        ValidateCultureCropsAreaService.execute(
          Area.create(cultureArea),
          Area.create(cropsArea).sum(crop.allocatedArea),
        );

        return await this.repository.update(crop, client);
      });

      return CropMapper.toResponse([result])[0];
    });
  }
}
