import { InvalidAreaError } from 'src/shared/domain/errors/invalidAreaError';

export const MINIMUM_ALLOCATED_AREA = 1;

export class Area {
  private constructor(private value: number) {}

  static create(value: number): Area {
    if (value < 0) throw new InvalidAreaError('Area must be greater than zero');

    return new Area(Math.round(value * 100) / 100);
  }

  get getValue() {
    return this.value;
  }

  sum(area: Area): Area {
    return Area.create(this.value + area.getValue);
  }
}
