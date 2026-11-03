import { Area } from 'src/shared/domain/value-objects/area';
import { InvalidAreaError } from 'src/shared/domain/errors/invalidAreaError';

export class ValidateCultureAreaService {
  static execute(
    propertyArea: Area,
    existingCulturesArea: Area,
    newCultureArea: Area,
  ): void {
    const totalAllocated = existingCulturesArea.sum(newCultureArea);

    if (totalAllocated.getValue > propertyArea.getValue) {
      throw new InvalidAreaError(
        'Culture sum area exceed property total area.',
      );
    }
  }
}
