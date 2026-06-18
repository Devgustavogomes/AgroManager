import { Injectable } from '@nestjs/common';
import { CultureContract } from '../../domain/repositories/cultureRepository.interface';

@Injectable()
export class IsCultureOwnerUseCase {
  constructor(private readonly cultureRepository: CultureContract) {}

  async execute(producerId: string, cultureId: string): Promise<boolean> {
    return await this.cultureRepository.isOwner(producerId, cultureId);
  }
}
