import { BadRequestException, Injectable } from '@nestjs/common';
import { CultureContract } from '../../domain/repositories/cultureRepository.interface';
import { UpdateCultureInput } from '../dto/updateCulture.dto';
import { CultureOutput } from '../dto/cultureOutput.dto';
import { CultureMapper } from '../../infrastructure/culture.mapper';
import { DatabaseContract } from '@agromanager/infra/database/contract';

@Injectable()
export class UpdateCultureUseCase {
  constructor(
    private readonly cultureRepository: CultureContract,
    private readonly databaseService: DatabaseContract,
  ) {}

  async execute(id: string, dto: UpdateCultureInput): Promise<CultureOutput> {
    return await this.databaseService.transaction(async (client) => {
      const culture = await this.cultureRepository.findById(id, client);

      if (dto.name !== undefined) culture.changeName = dto.name;

      if (dto.allocatedArea !== undefined)
        culture.changeAllocatedArea = dto.allocatedArea;

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
