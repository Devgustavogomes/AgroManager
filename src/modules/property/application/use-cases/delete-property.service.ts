import { Injectable } from '@nestjs/common';
import { PropertyRepository } from '../../infrastructure/persistence/repository';

@Injectable()
export class DeletePropertyUseCase {
  constructor(private readonly propertyRepository: PropertyRepository) {}

  async execute(slug: string, producerId: string) {
    await this.propertyRepository.delete(slug, producerId);
  }
}
