import { Area } from 'src/shared/domain/value-object/area';
import { InvalidAreaError } from 'src/shared/domain/errors/invalidAreaError';

export class ValidateCultureCropsAreaService {
  static execute(allocatedArea: Area, sumCropsArea: Area): void {
    if (sumCropsArea.getValue > allocatedArea.getValue) {
      throw new InvalidAreaError(
        'The sum of crops is greater than the allocated area',
      );
    }
  }
}
