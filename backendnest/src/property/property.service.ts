import { Injectable, NotFoundException } from '@nestjs/common';
import { PropertyRepository } from './property.repository';
import { PropertyOutputDto } from './dto/propertyOutput.dto';

@Injectable()
export class PropertyService {
  constructor(private readonly propertyRepository: PropertyRepository) {}

  async findById(id: string): Promise<PropertyOutputDto> {
    const property = await this.propertyRepository.findById(id);

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    return property;
  }
}
