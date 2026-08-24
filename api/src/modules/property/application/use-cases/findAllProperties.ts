import { Injectable } from '@nestjs/common';
import { PropertyOutputDto } from '../dto/output.dto';
import { PropertyContract } from '../../domain/repositories/propertyRepository.contract';
import { PropertyMapper } from '../../infrastructure/property.mapper';

@Injectable()
export class FindAllPropertiesUseCase {
  constructor(private readonly propertyRepository: PropertyContract) {}

  async execute(producerId: string): Promise<PropertyOutputDto[]> {
    const properties =
      await this.propertyRepository.findAllByProducerId(producerId);

    return properties.map((property) => PropertyMapper.toResponse(property));
  }
}
