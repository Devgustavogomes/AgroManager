import { Injectable } from '@nestjs/common';
import { CultureContract } from '../../domain/repositories/culture.repository.interface';
import { CreateCultureInput } from '../dto/createCulture.dto';
import { CultureOutput } from '../dto/cultureOutput.dto';
import { Culture } from '../../domain/entities/culture.entity';
import { Area } from 'src/shared/domain/value-object/area';
import { CultureMapper } from '../../infrastructure/culture.mapper';
import { DatabaseService } from 'src/infra/database/service';
import { InvalidAreaError } from 'src/shared/domain/errors/invalidAreaError';

@Injectable()
export class CreateCultureUseCase {
  constructor(
    private readonly cultureRepository: CultureContract,
    private readonly databaseService: DatabaseService,
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

      const cultureSumArea = cultureAreaSum.sum(culture.allocatedArea);

      if (cultureSumArea.getValue > propertyArea.getValue) {
        throw new InvalidAreaError(
          'Culture sum area exceed property total area.',
        );
      }

      const result = await this.cultureRepository.create(culture, client);

      return CultureMapper.toResponse([result])[0];
    });
  }
}
