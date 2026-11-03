import { Entity } from 'src/shared/domain/entities/entity';
import { InvalidAreaError } from 'src/shared/domain/errors/invalidAreaError';
import {
  Area,
  MINIMUM_ALLOCATED_AREA,
} from 'src/shared/domain/value-objects/area';
import { Optional } from 'src/shared/application/types/optional';

export interface CultureProps {
  cultureId: string;
  name: string;
  allocatedArea: Area;
  propertyId: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export class Culture extends Entity<CultureProps, { cultureName: string }> {
  private constructor(props: CultureProps) {
    super(props);
    this.validateAreas();
  }

  static create(props: Optional<CultureProps, 'createdAt' | 'updatedAt'>) {
    const culture = new Culture({
      ...props,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? null,
    });

    culture.domainEvents.push({
      event: 'culture.created',
      data: {
        cultureName: culture.name,
      },
    });

    return culture;
  }

  static reconstitute(props: CultureProps) {
    return new Culture(props);
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

      this.domainEvents.push({
        event: 'culture.updated',
        data: {
          cultureName: this.props.name,
        },
      });
    }
  }

  private validateAreas() {
    if (this.props.allocatedArea.getValue < MINIMUM_ALLOCATED_AREA) {
      throw new InvalidAreaError(
        `Allocated area must be at least ${MINIMUM_ALLOCATED_AREA}`,
      );
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

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }
}
