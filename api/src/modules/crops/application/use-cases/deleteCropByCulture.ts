import { Injectable } from '@nestjs/common';
import { CropContract } from '../../domain/repositories/crops-repository.contract';

@Injectable()
export class DeleteCropByCultureUseCase {
  constructor(private readonly repository: CropContract) {}

  async execute(cultureId: string): Promise<void> {
    await this.repository.deleteByCulture(cultureId);
  }
}
