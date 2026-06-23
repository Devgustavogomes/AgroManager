import { Injectable } from '@nestjs/common';
import { CultureContract } from '../../domain/repositories/cultureRepository.interface';
import { CreateCultureInput } from '../dto/createCulture.dto';
import { CultureOutput } from '../dto/cultureOutput.dto';
import { Culture } from '../../domain/entities/culture.entity';
import { Area } from 'src/shared/domain/value-object/area';
import { CultureMapper } from '../../infrastructure/culture.mapper';
import { DatabaseContract } from '@agromanager/infra/database/contract';
import { ValidateCultureAreaService } from '../../domain/services/validateCultureArea.service';

@Injectable()
export class CreateCultureUseCase {
  constructor(
    private readonly cultureRepository: CultureContract,
    private readonly databaseService: DatabaseContract,
  ) {}

  async execute(
    slug: string,
    propertyId: string,
    dto: CreateCultureInput,
  ): Promise<CultureOutput> {
    return await this.databaseService.transaction(async (client) => {
      const propertyArea = await this.cultureRepository.getPropertyArea(
        slug,
        client,
      );

      const cultureAreaSum = await this.cultureRepository.cultureAreaSum(
        propertyId,
        client,
      );

      const allocatedArea = Area.create(dto.allocatedArea);

      const culture = Culture.create({ ...dto, allocatedArea, propertyId });

      ValidateCultureAreaService.execute(
        propertyArea,
        cultureAreaSum,
        culture.allocatedArea,
      );

      const result = await this.cultureRepository.create(culture, client);

      return CultureMapper.toResponse([result])[0];
    });
  }
}
