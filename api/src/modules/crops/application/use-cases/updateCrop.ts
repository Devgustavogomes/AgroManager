import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CropContract } from '../../domain/repositories/crops-repository.contract';
import { UpdateCropInput } from '../dto/updateCrop.dto';
import { CropOutput } from '../dto/cropOutput.dto';
import { CropMapper } from '../../infrastructure/crop.mapper';
import { DatabaseService } from 'src/infra/database/service';

@Injectable()
export class UpdateCropUseCase {
  constructor(
    private readonly repository: CropContract,
    private readonly databaseService: DatabaseService,
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

      if (dto.name !== undefined) {
        crop.name = dto.name;
      }

      if (dto.plantingDate !== undefined) {
        crop.plantingDate = new Date(dto.plantingDate);
      }

      if (dto.harvestDateExpected !== undefined) {
        crop.harvestDateExpected = new Date(dto.harvestDateExpected);
      }

      if (dto.harvestDateActual !== undefined) {
        crop.harvestDateActual = dto.harvestDateActual
          ? new Date(dto.harvestDateActual)
          : null;
      }

      if (dto.status !== undefined) {
        crop.status = dto.status;
      }

      if (dto.pestStatus !== undefined) {
        crop.pestStatus = dto.pestStatus;
      }

      if (dto.allocatedArea !== undefined) {
        const cultureArea = await this.repository.getCultureArea(
          crop.cultureId,
          client,
        );

        if (dto.allocatedArea > cultureArea) {
          throw new BadRequestException(
            'Allocated area must be less than or equal to culture area',
          );
        }

        crop.allocatedArea = dto.allocatedArea;
      }

      const result = await this.repository.update(crop, client);

      return CropMapper.toResponse([result])[0];
    });
  }
}
