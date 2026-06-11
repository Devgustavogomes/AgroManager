import { Injectable, NotFoundException } from '@nestjs/common';
import { PropertyContract } from '../../domain/repositories/property-repository.interface';
import { UpdatePropertyDto } from '../dtos/update.dto';

@Injectable()
export class UpdatePropertyUseCase {
  constructor(private readonly propertyRepository: PropertyContract) {}

  async execute(slug: string, producerId: string, dto: UpdatePropertyDto) {
    const property = await this.propertyRepository.findBySlug(slug, producerId);

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    if (dto.name !== undefined) property.changeName = dto.name;
    if (dto.city !== undefined) property.changeCity = dto.city;
    if (dto.state !== undefined) property.changeState = dto.state;

    if (dto.slug !== undefined) property.changeSlug = dto.slug;

    if (dto.totalArea !== undefined) property.changeTotalArea = dto.totalArea;
    if (dto.arableArea !== undefined)
      property.changeArableArea = dto.arableArea;
    if (dto.vegetationArea !== undefined)
      property.changeVegetationArea = dto.vegetationArea;

    return await this.propertyRepository.update(slug, producerId, property);
  }
}
