import { Entity } from 'src/shared/domain/entities/entity';
import { Area } from 'src/shared/domain/value-object/area';
import { Optional } from 'src/shared/types/optional';

interface CultureProps {
  cultureId: string;
  name: string;
  allocatedArea: Area;
  propertyId: string;
  createdAt: Date;
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

  private validateAreas() {
    if (this.props.allocatedArea.getValue < 1) {
      throw new Error('Allocated area must be greater than 0');
    }
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  set changeName(name: string) {
    this.props.name = name;
    this.touch();
  }

  set changeAllocatedArea(allocatedArea: number) {
    this.props.allocatedArea = Area.create(allocatedArea);
    this.validateAreas();
    this.touch();
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
