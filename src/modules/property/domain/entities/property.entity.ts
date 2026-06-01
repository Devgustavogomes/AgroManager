import { Entity } from 'src/shared/domain/entities/entity';
import { Optional } from 'src/shared/types/optional';
import { Area } from '../../../../shared/domain/value-object/area';
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

  set changeName(name: string) {
    this.props.name = name;

    this.props.slug = Slug.createFromText(name);
    this.touch();
  }

  set changeCity(city: string) {
    this.props.city = city;
    this.touch();
  }

  set changeState(state: string) {
    this.props.state = state;
    this.touch();
  }

  set changeSlug(slug: string) {
    this.props.slug = Slug.createFromText(slug);
    this.touch();
  }

  set changeTotalArea(area: number) {
    this.props.totalArea = Area.create(area);
    this.validateAreas();
    this.touch();
  }

  set changeArableArea(area: number) {
    this.props.arableArea = Area.create(area);
    this.validateAreas();
    this.touch();
  }

  set changeVegetationArea(area: number) {
    this.props.vegetationArea = Area.create(area);
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
