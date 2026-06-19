import { Injectable } from '@nestjs/common';
import { CropContract } from '../../domain/repositories/crops-repository.contract';
import { CropOutput } from '../dto/cropOutput.dto';
import { CropMapper } from '../../infrastructure/crop.mapper';

@Injectable()
export class FindCropByIdUseCase {
  constructor(private readonly repository: CropContract) {}

  async execute(cropId: string): Promise<CropOutput> {
    const result = await this.repository.findById(cropId);

    return CropMapper.toResponse([result])[0];
  }
}
