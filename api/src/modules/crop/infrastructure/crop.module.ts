import { Module } from '@nestjs/common';

import { CropController } from '../presentation/crops.controller';
import { CreateCropUseCase } from '../application/use-cases/createCrop';
import { UpdateCropUseCase } from '../application/use-cases/updateCrop';
import { FindCropByCultureUseCase } from '../application/use-cases/findCropByCulture';
import { FindCropByIdUseCase } from '../application/use-cases/findCropById';
import { DeleteCropByIdUseCase } from '../application/use-cases/deleteCropById';
import { DeleteCropByCultureUseCase } from '../application/use-cases/deleteCropByCulture';
import { CropRepository } from './persistence/crop.repository';
import { CropContract } from '../domain/repositories/cropsRepository.contract';
import { IsCropOwnerUseCase } from '../application/use-cases/isCropOwner';

@Module({
  controllers: [CropController],
  providers: [
    { provide: CropContract, useClass: CropRepository },
    CreateCropUseCase,
    UpdateCropUseCase,
    FindCropByCultureUseCase,
    FindCropByIdUseCase,
    DeleteCropByIdUseCase,
    DeleteCropByCultureUseCase,
    IsCropOwnerUseCase,
  ],
})
export class CropModule {}
