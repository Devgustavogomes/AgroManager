import { BadRequestException, Injectable } from '@nestjs/common';
import { CultureContract } from '../../domain/repositories/culture.repository.interface';
import { UpdateCultureInput } from '../dto/updateCulture.dto';
import { CultureOutput } from '../dto/cultureOutput.dto';
import { CultureMapper } from '../../infrastructure/culture.mapper';
import { DatabaseService } from 'src/infra/database/service';

@Injectable()
export class UpdateCultureUseCase {
  constructor(
    private readonly cultureRepository: CultureContract,
    private readonly databaseService: DatabaseService,
  ) {}

  async execute(id: string, dto: UpdateCultureInput): Promise<CultureOutput> {
    return await this.databaseService.transaction(async (client) => {
      const culture = await this.cultureRepository.findById(id, client);

      if (dto.name) culture.changeName = dto.name;

      if (dto.allocatedArea) culture.changeAllocatedArea = dto.allocatedArea;

      const sumCrops = await this.cultureRepository.cropSum(id, client);

      if (sumCrops > culture.allocatedArea.getValue) {
        throw new BadRequestException(
          'The sum of crops is greater than the allocated area',
        );
      }

      const result = await this.cultureRepository.update(culture, client);

      return CultureMapper.toResponse([result])[0];
    });
  }
}
