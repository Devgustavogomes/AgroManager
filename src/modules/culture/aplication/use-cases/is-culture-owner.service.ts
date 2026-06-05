import { Injectable } from '@nestjs/common';
import { CultureContract } from '../../domain/repositories/culture.repository.interface';

@Injectable()
export class IsCultureOwnerUseCase {
  constructor(private readonly cultureRepository: CultureContract) {}

  async execute(producerId: string, cultureId: string): Promise<boolean> {
    const result = await this.cultureRepository.isOwner(producerId, cultureId);

    if (!result) {
      return false;
    }

    return true;
  }
}
