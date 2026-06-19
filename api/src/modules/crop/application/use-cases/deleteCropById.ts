import { Injectable } from '@nestjs/common';
import { CropContract } from '../../domain/repositories/crops-repository.contract';

@Injectable()
export class DeleteCropByIdUseCase {
  constructor(private readonly repository: CropContract) {}

  async execute(cropId: string): Promise<void> {
    await this.repository.deleteById(cropId);
  }
}
