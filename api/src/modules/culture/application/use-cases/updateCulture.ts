import { Injectable } from '@nestjs/common';
import { CultureContract } from '../../domain/repositories/cultureRepository.interface';
import { UpdateCultureInput } from '../dto/updateCulture.dto';
import { CultureOutput } from '../dto/cultureOutput.dto';
import { CultureMapper } from '../../infrastructure/culture.mapper';
import { DatabaseContract } from '@agromanager/infra/database/contract';
import { Area } from 'src/shared/domain/value-objects/area';
import { ValidateCultureCropsAreaService } from '../../../../shared/domain/services/validateCultureCropsArea.service';
import { NotFoundError } from 'src/shared/domain/errors/notFoundError';
import { EventEmitterContract } from 'src/shared/domain/providers/emitterProvider.contract';

@Injectable()
export class UpdateCultureUseCase {
  constructor(
    private readonly cultureRepository: CultureContract,
    private readonly databaseService: DatabaseContract,
    private readonly eventEmitter: EventEmitterContract,
  ) {}

  async execute(
    id: string,
    producerId: string,
    dto: UpdateCultureInput,
  ): Promise<CultureOutput> {
    return await this.databaseService.transaction(async (client) => {
      const culture = await this.cultureRepository.findById(id, client);

      if (!culture) {
        throw new NotFoundError('Culture not found');
      }

      culture.update({
        name: dto.name,
        allocatedArea: dto.allocatedArea
          ? Area.create(dto.allocatedArea)
          : undefined,
      });

      const sumCrops = await this.cultureRepository.cropSum(id, client);

      ValidateCultureCropsAreaService.execute(
        culture.allocatedArea,
        Area.create(sumCrops),
      );

      const result = await this.cultureRepository.update(culture, client);

      culture.getDomainEvents(producerId).forEach((event) => {
        this.eventEmitter.emit(event);
      });

      culture.clearDomainEvents();

      return CultureMapper.toResponse([result])[0];
    });
  }
}
