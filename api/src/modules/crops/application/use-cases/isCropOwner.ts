import { Injectable } from '@nestjs/common';
import { CropContract } from '../../domain/repositories/crops-repository.contract';

@Injectable()
export class IsCropOwnerUseCase {
  constructor(private readonly repository: CropContract) {}

  async execute(producerId: string, cropId: string): Promise<boolean> {
    return await this.repository.isOwner(producerId, cropId);
  }
}
