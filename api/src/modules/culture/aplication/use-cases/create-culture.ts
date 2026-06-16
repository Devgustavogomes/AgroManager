import { Injectable } from '@nestjs/common';
import { CultureContract } from '../../domain/repositories/culture.repository.interface';
import { CreateCultureInput } from '../dto/createCulture.dto';
import { CultureOutput } from '../dto/cultureOutput.dto';
import { Culture } from '../../domain/entities/culture.entity';
import { Area } from 'src/shared/domain/value-object/area';
import { CultureMapper } from '../../infrastructure/culture.mapper';

@Injectable()
export class CreateCultureUseCase {
  constructor(private readonly cultureRepository: CultureContract) {}

  async execute(
    propertyId: string,
    dto: CreateCultureInput,
  ): Promise<CultureOutput> {
    const allocatedArea = Area.create(dto.allocatedArea);

    const culture = Culture.create({ ...dto, allocatedArea, propertyId });
    // colocar locks
    const result = await this.cultureRepository.create(culture);

    return CultureMapper.toResponse([result])[0];
  }
}
