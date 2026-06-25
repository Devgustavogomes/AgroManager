import { Entity } from 'src/shared/domain/entities/entity';
import { InvalidAreaError } from 'src/shared/domain/errors/invalidAreaError';
import { Area } from 'src/shared/domain/value-object/area';
import { Optional } from 'src/shared/types/optional';

interface CultureProps {
  cultureId: string;
  name: string;
  allocatedArea: Area;
  propertyId: string;
  createdAt: Date | string;
  updatedAt: Date | null;
}

export class Culture extends Entity<CultureProps> {
  private constructor(props: CultureProps) {
    super(props);
    this.validateAreas();
  }

  static create(
    props: Optional<CultureProps, 'createdAt' | 'updatedAt' | 'cultureId'>,
  ) {
    return new Culture({
      ...props,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? null,
      cultureId: props.cultureId ?? 'non-registered',
    });
  }

  update(property: Partial<Pick<CultureProps, 'name' | 'allocatedArea'>>) {
    let updated = false;

    if (property.name !== undefined) {
      this.props.name = property.name;
      updated = true;
    }
    if (property.allocatedArea !== undefined) {
      this.props.allocatedArea = property.allocatedArea;
      updated = true;
    }
    if (updated) {
      this.touch();
      this.validateAreas();
    }
  }

  private validateAreas() {
    if (this.props.allocatedArea.getValue < 1) {
      throw new InvalidAreaError('Allocated area must be greater than 0');
    }
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  get name() {
    return this.props.name;
  }

  get allocatedArea() {
    return this.props.allocatedArea;
  }

  get propertyId() {
    return this.props.propertyId;
  }

  get cultureId() {
    return this.props.cultureId;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }
}
