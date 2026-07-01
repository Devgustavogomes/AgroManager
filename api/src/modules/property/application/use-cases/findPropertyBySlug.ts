import { PropertyMapper } from '../../infrastructure/persistence/property.mapper';
import { Injectable } from '@nestjs/common';
import { PropertyOutputDto } from '../dto/output.dto';
import { PropertyContract } from '../../domain/repositories/propertyRepository.contract';
import { NotFoundError } from 'src/shared/domain/errors/notFoundError';

@Injectable()
export class FindBySlugUseCase {
  constructor(private readonly propertyRepository: PropertyContract) {}

  async execute(slug: string, producerId: string): Promise<PropertyOutputDto> {
    const property = await this.propertyRepository.findBySlug(slug, producerId);

    if (!property) {
      throw new NotFoundError('Property not found');
    }

    return PropertyMapper.toResponse(property);
  }
}
