import { Entity } from 'src/shared/domain/entities/entity';
import { Optional } from 'src/shared/types/optional';
import { Area } from '../../../../shared/domain/value-object/area';
import { Slug } from '../value-object/slug';
import { InvalidAreaError } from 'src/shared/domain/errors/invalidAreaError';

export interface PropertyProps {
  propertyId?: string;
  producerId: string;
  name: string;
  slug: Slug;
  city: string;
  state: string;
  totalArea: Area;
  arableArea: Area;
  vegetationArea: Area;
  createdAt: Date;
  updatedAt: Date | null;
}

export class Property extends Entity<PropertyProps> {
  private constructor(props: PropertyProps) {
    super(props);

    this.validateAreas();
  }

  static create(
    props: Optional<PropertyProps, 'slug' | 'createdAt' | 'updatedAt'>,
  ) {
    return new Property({
      ...props,
      slug: props.slug ?? Slug.createFromText(props.name),
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? null,
    });
  }

  update(
    property: Partial<
      Omit<
        PropertyProps,
        'propertyId' | 'producerId' | 'createdAt' | 'updatedAt'
      >
    >,
  ) {
    let updated = false;

    if (property.name) {
      this.props.name = property.name;
      this.props.slug = Slug.createFromText(property.name);
      updated = true;
    }

    if (property.city) {
      this.props.city = property.city;
      updated = true;
    }

    if (property.state) {
      this.props.state = property.state;
      updated = true;
    }

    if (property.slug) {
      this.props.slug = property.slug;
      updated = true;
    }

    if (property.totalArea) {
      this.props.totalArea = property.totalArea;
      updated = true;
    }

    if (property.arableArea) {
      this.props.arableArea = property.arableArea;
      updated = true;
    }

    if (property.vegetationArea) {
      this.props.vegetationArea = property.vegetationArea;
      updated = true;
    }

    if (updated) {
      this.touch();
      this.validateAreas();
    }
  }

  private validateAreas() {
    const sum = this.props.arableArea.sum(this.props.vegetationArea);

    if (sum > this.props.totalArea) {
      throw new InvalidAreaError(
        'Arable area plus vegetation area cannot exceed total area',
      );
    }
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  get getProducerId() {
    return this.props.producerId;
  }
  get getName() {
    return this.props.name;
  }
  get getSlug() {
    return this.props.slug.getSlug;
  }
  get getCity() {
    return this.props.city;
  }
  get getState() {
    return this.props.state;
  }
  get getArableArea() {
    return this.props.arableArea.getValue;
  }
  get getVegetationArea() {
    return this.props.vegetationArea.getValue;
  }
  get getTotalArea() {
    return this.props.totalArea.getValue;
  }
  get getCreatedAt() {
    return this.props.createdAt;
  }
  get getUpdatedAt() {
    return this.props.updatedAt;
  }
  get getPropertyId() {
    return this.props.propertyId;
  }
}
