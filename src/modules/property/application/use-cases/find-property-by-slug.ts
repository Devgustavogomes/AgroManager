import { PropertyMapper } from '../../infrastructure/persistence/property.mapper';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PropertyRepository } from '../../infrastructure/persistence/property.repository';
import { PropertyOutputDto } from '../dtos/output.dto';

@Injectable()
export class FindBySlugUseCase {
  constructor(private readonly propertyRepository: PropertyRepository) {}

  async execute(slug: string, producerId: string): Promise<PropertyOutputDto> {
    const property = await this.propertyRepository.findBySlug(slug, producerId);

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    return PropertyMapper.toResponse(property);
  }
}
