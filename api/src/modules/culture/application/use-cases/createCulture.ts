import { Injectable } from '@nestjs/common';
import { CultureContract } from '../../domain/repositories/cultureRepository.contract';
import { CreateCultureInput } from '../dto/createCulture.dto';
import { CultureOutput } from '../dto/cultureOutput.dto';
import { Culture } from '../../domain/entities/culture.entity';
import { Area } from 'src/shared/domain/value-objects/area';
import { CultureMapper } from '../../infrastructure/culture.mapper';
import { DatabaseContract } from '@agromanager/infra/database/contract';
import { ValidateCultureAreaService } from '../../domain/services/validateCultureArea.service';
import { EventEmitterContract } from 'src/shared/domain/providers/emitterProvider.contract';

@Injectable()
export class CreateCultureUseCase {
  constructor(
    private readonly cultureRepository: CultureContract,
    private readonly databaseService: DatabaseContract,
    private readonly eventEmitter: EventEmitterContract,
  ) {}

  async execute(
    slug: string,
    producerId: string,
    dto: CreateCultureInput,
  ): Promise<CultureOutput> {
    const result = await this.databaseService.transaction(async (client) => {
      const [propertyId, propertyArea] = await Promise.all([
        this.cultureRepository.findPropertyBySlug(slug, client),
        this.cultureRepository.getPropertyArea(slug, client),
      ]);

      const cultureAreaSum = await this.cultureRepository.cultureAreaSum(
        propertyId,
        client,
      );

      const culture = Culture.create({
        name: dto.name,
        allocatedArea: Area.create(dto.allocatedArea),
        propertyId,
      });

      ValidateCultureAreaService.execute(
        propertyArea,
        cultureAreaSum,
        culture.allocatedArea,
      );

      const result = await this.cultureRepository.create(culture, client);

      culture.getDomainEvents(producerId).forEach((event) => {
        this.eventEmitter.emit(event);
      });

      culture.clearDomainEvents();

      return result;
    });

    return CultureMapper.toResponse([result])[0];
  }
}
