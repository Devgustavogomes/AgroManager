import { Injectable } from '@nestjs/common';
import { CropContract } from '../../domain/repositories/crops-repository.contract';
import { CropOutput } from '../dto/cropOutput.dto';
import { CropMapper } from '../../infrastructure/crop.mapper';

@Injectable()
export class FindCropByCultureUseCase {
  constructor(private readonly repository: CropContract) {}

  async execute(cultureId: string): Promise<CropOutput[]> {
    const result = await this.repository.findByCulture(cultureId);

    return CropMapper.toResponse(result);
  }
}
