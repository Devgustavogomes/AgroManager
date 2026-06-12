import { Entity } from 'src/shared/domain/entities/entity';
import { CropStatus } from '../constants/crop-status.enum';
import { PestStatus } from '../constants/pest-status';
import { Optional } from 'src/shared/types/optional';
import { Area } from 'src/shared/domain/value-object/area';
import { BadRequestException } from '@nestjs/common';

interface CreateCropEntity {
  cropId: string;
  cultureId: string;
  name: string;
  status: CropStatus;
  allocatedArea: Area;
  plantingDate: Date;
  harvestDateExpected: Date;
  harvestDateActual: Date | null;
  pestStatus: PestStatus;
  createdAt: Date;
  updatedAt: Date | null;
}

export class Crop extends Entity<CreateCropEntity> {
  private constructor(props: CreateCropEntity) {
    super(props);
    this.validateArea();
  }
  public static create(
    props: Optional<
      CreateCropEntity,
      'createdAt' | 'updatedAt' | 'cropId' | 'harvestDateActual'
    >,
  ) {
    return new Crop({
      ...props,
      cropId: props.cropId ?? 'non-registered',
      harvestDateActual: props.harvestDateActual ?? null,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? null,
    });
  }
  private touch() {
    this.props.updatedAt = new Date();
  }

  private validateArea() {
    if (this.props.allocatedArea.getValue <= 0) {
      throw new BadRequestException('Allocated area must be greater than 0');
    }
  }

  set allocatedArea(allocatedArea: number) {
    this.props.allocatedArea = Area.create(allocatedArea);
    this.touch();
    this.validateArea();
  }

  set pestStatus(pestStatus: PestStatus) {
    this.props.pestStatus = pestStatus;
    this.touch();
  }

  set status(status: CropStatus) {
    this.props.status = status;
    this.touch();
  }

  set harvestDateActual(harvestDateActual: Date) {
    this.props.harvestDateActual = harvestDateActual;
    this.touch();
  }

  set harvestDateExpected(harvestDateExpected: Date) {
    this.props.harvestDateExpected = harvestDateExpected;
    this.touch();
  }

  set plantingDate(plantingDate: Date) {
    this.props.plantingDate = plantingDate;
    this.touch();
  }

  get cropId(): string {
    return this.props.cropId;
  }

  get cultureId(): string {
    return this.props.cultureId;
  }

  get name(): string {
    return this.props.name;
  }

  get status(): CropStatus {
    return this.props.status;
  }

  get allocatedArea(): Area {
    return this.props.allocatedArea;
  }

  get plantingDate(): Date {
    return this.props.plantingDate;
  }

  get harvestDateExpected(): Date {
    return this.props.harvestDateExpected;
  }

  get harvestDateActual(): Date | null {
    return this.props.harvestDateActual;
  }

  get pestStatus(): PestStatus {
    return this.props.pestStatus;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date | null {
    return this.props.updatedAt;
  }
}
