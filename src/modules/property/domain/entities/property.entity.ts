import { Entity } from 'src/shared/domain/entities/entity';
import { Optional } from 'src/shared/types/optional';
import { Area } from '../value-object/area';
import { Slug } from '../value-object/slug';
import { InvalidAreaError } from 'src/shared/domain/errors/invalidAreaError';
import { UpdatePropertyDto } from '../../application/dtos/update.dto';

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

export class PropertyEntity extends Entity<PropertyProps> {
  private constructor(props: PropertyProps) {
    super(props);

    this.validateAreas();
  }

  static create(
    props: Optional<PropertyProps, 'slug' | 'createdAt' | 'updatedAt'>,
  ) {
    return new PropertyEntity({
      ...props,
      slug: props.slug ?? Slug.createFromText(props.name),
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? null,
    });
  }

  update(data: UpdatePropertyDto) {
    if (data.name !== undefined) {
      this.props.name = data.name;

      this.props.slug = Slug.createFromText(data.name);
    }

    if (data.city !== undefined) {
      this.props.city = data.city;
    }

    if (data.state !== undefined) {
      this.props.state = data.state;
    }

    if (data.slug !== undefined) {
      this.props.slug = Slug.createFromText(data.slug);
    }

    if (data.totalArea !== undefined) {
      this.props.totalArea = Area.create(data.totalArea);
    }

    if (data.arableArea !== undefined) {
      this.props.arableArea = Area.create(data.arableArea);
    }

    if (data.vegetationArea !== undefined) {
      this.props.vegetationArea = Area.create(data.vegetationArea);
    }

    this.validateAreas();

    this.touch();
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
    return this.props.name;
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
