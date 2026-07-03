import { InvalidAreaError } from 'src/shared/domain/errors/invalidAreaError';

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
