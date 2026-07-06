import { Area } from 'src/shared/domain/value-objects/area';
import { InvalidAreaError } from 'src/shared/domain/errors/invalidAreaError';
import { ValidateCultureAreaService } from './validateCultureArea.service';

describe('ValidateCultureAreaService', () => {
  it('should validate successfully when the total sum does not exceed property area', () => {
    const propertyArea = Area.create(100);
    const existingCulturesArea = Area.create(40);
    const newCultureArea = Area.create(30);

    expect(() => {
      ValidateCultureAreaService.execute(
        propertyArea,
        existingCulturesArea,
        newCultureArea,
      );
    }).not.toThrow();
  });

  it('should throw InvalidAreaError when the total sum exceeds property area', () => {
    const propertyArea = Area.create(100);
    const existingCulturesArea = Area.create(60);
    const newCultureArea = Area.create(50); // 60 + 50 = 110 > 100

    expect(() => {
      ValidateCultureAreaService.execute(
        propertyArea,
        existingCulturesArea,
        newCultureArea,
      );
    }).toThrow(InvalidAreaError);

    expect(() => {
      ValidateCultureAreaService.execute(
        propertyArea,
        existingCulturesArea,
        newCultureArea,
      );
    }).toThrow('Culture sum area exceed property total area.');
  });
});
