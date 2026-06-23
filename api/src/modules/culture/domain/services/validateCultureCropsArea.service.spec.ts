import { Area } from 'src/shared/domain/value-object/area';
import { InvalidAreaError } from 'src/shared/domain/errors/invalidAreaError';
import { ValidateCultureCropsAreaService } from './validateCultureCropsArea.service';

describe('ValidateCultureCropsAreaService', () => {
  it('should validate successfully when sum of crops is less than or equal to allocated area', () => {
    const allocatedArea = Area.create(100);
    const sumCropsArea = Area.create(80);

    expect(() => {
      ValidateCultureCropsAreaService.execute(allocatedArea, sumCropsArea);
    }).not.toThrow();
  });

  it('should throw InvalidAreaError when sum of crops exceeds allocated area', () => {
    const allocatedArea = Area.create(100);
    const sumCropsArea = Area.create(120);

    expect(() => {
      ValidateCultureCropsAreaService.execute(allocatedArea, sumCropsArea);
    }).toThrow(InvalidAreaError);

    expect(() => {
      ValidateCultureCropsAreaService.execute(allocatedArea, sumCropsArea);
    }).toThrow('The sum of crops is greater than the allocated area');
  });
});
