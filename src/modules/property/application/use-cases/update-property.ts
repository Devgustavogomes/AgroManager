import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PropertyRepository } from '../../infrastructure/persistence/property.repository';
import { UpdatePropertyDto } from '../dtos/update.dto';

@Injectable()
export class UpdatePropertyUseCase {
  constructor(private readonly propertyRepository: PropertyRepository) {}

  async execute(slug: string, producerId: string, dto: UpdatePropertyDto) {
    const hasUpdates = Object.values(dto).some((value) => value !== undefined);

    if (!hasUpdates) {
      throw new BadRequestException('No fields provided for update');
    }

    const property = await this.propertyRepository.findBySlug(slug, producerId);

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    property.update(dto);

    return await this.propertyRepository.update(slug, producerId, property);
  }
}
