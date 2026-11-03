import { Injectable } from '@nestjs/common';
import { PropertyContract } from '../../domain/repositories/propertyRepository.contract';

@Injectable()
export class DeletePropertyUseCase {
  constructor(private readonly propertyRepository: PropertyContract) {}

  async execute(slug: string, producerId: string) {
    await this.propertyRepository.delete(slug, producerId);
  }
}
