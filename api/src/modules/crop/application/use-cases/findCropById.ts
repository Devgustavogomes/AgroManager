import { Injectable } from '@nestjs/common';
import { CropContract } from '../../domain/repositories/cropsRepository.contract';
import { CropOutput } from '../dto/cropOutput.dto';
import { CropMapper } from '../../infrastructure/crop.mapper';
import { NotFoundError } from 'src/shared/domain/errors/notFoundError';

@Injectable()
export class FindCropByIdUseCase {
  constructor(private readonly repository: CropContract) {}

  async execute(cropId: string): Promise<CropOutput> {
    const result = await this.repository.findById(cropId);

    if (!result) {
      throw new NotFoundError('Crop not found');
    }

    return CropMapper.toResponse([result])[0];
  }
}
