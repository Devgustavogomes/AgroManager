import { Injectable } from '@nestjs/common';
import { PropertyContract } from '../../domain/repositories/property-repository.interface';

@Injectable()
export class IsPropertyOwnerUseCase {
  constructor(private readonly propertyRepository: PropertyContract) {}

  async execute(producerId: string, propertyId: string): Promise<boolean> {
    const result = await this.propertyRepository.isOwner(
      producerId,
      propertyId,
    );

    if (!result) {
      return false;
    }

    return true;
  }
}
