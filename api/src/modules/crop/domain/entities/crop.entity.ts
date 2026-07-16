import { Entity } from 'src/shared/domain/entities/entity';
import { CropStatus } from '../constants/crop-status.enum';
import { PestStatus } from '../constants/pest-status.enum';
import { Optional } from 'src/shared/application/types/optional';
import {
  Area,
  MINIMUM_ALLOCATED_AREA,
} from 'src/shared/domain/value-objects/area';
import { InvalidAreaError } from 'src/shared/domain/errors/invalidAreaError';
import { Notification } from 'src/shared/domain/entities/notification.entity';

interface CropProps {
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

export class Crop extends Entity<CropProps, Notification> {
  private constructor(props: CropProps) {
    super(props);
    this.validateArea();
  }
  public static create(
    props: Optional<
      CropProps,
      'createdAt' | 'updatedAt' | 'cropId' | 'harvestDateActual'
    >,
  ) {
    const crop = new Crop({
      ...props,
      cropId: props.cropId ?? 'non-registered',
      harvestDateActual: props.harvestDateActual ?? null,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? null,
    });

    crop.domainEvents.push({
      event: 'crop.created',
      data: Notification.create({
        event: 'crop.created',
        title: 'Nova safra cadastrada',
        content: `A safra "${crop.name}" foi cadastrada com sucesso.`,
      }),
    });

    return crop;
  }

  public static reconstitute(props: CropProps) {
    return new Crop(props);
  }

  public update(
    crop: Partial<
      Omit<CropProps, 'cropId' | 'cultureId' | 'createdAt' | 'updatedAt'>
    >,
  ) {
    let updated = false;

    if (crop.name !== undefined) {
      this.props.name = crop.name;
      updated = true;
    }

    if (crop.status !== undefined) {
      this.props.status = crop.status;
      updated = true;
    }

    if (crop.allocatedArea !== undefined) {
      this.props.allocatedArea = crop.allocatedArea;
      updated = true;
    }

    if (crop.plantingDate !== undefined) {
      this.props.plantingDate = crop.plantingDate;
      updated = true;
    }

    if (crop.harvestDateExpected !== undefined) {
      this.props.harvestDateExpected = crop.harvestDateExpected;
      updated = true;
    }

    if (crop.harvestDateActual !== undefined) {
      this.props.harvestDateActual = crop.harvestDateActual;
      updated = true;
    }

    if (crop.pestStatus !== undefined) {
      this.props.pestStatus = crop.pestStatus;
      updated = true;
    }

    if (updated) {
      this.touch();
      this.validateArea();

      this.domainEvents.push({
        event: 'crop.updated',
        data: Notification.create({
          event: 'crop.updated',
          title: 'Safra atualizada',
          content: `A safra "${this.props.name}" foi atualizada com sucesso.`,
        }),
      });
    }
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  private validateArea() {
    if (this.props.allocatedArea.getValue < MINIMUM_ALLOCATED_AREA) {
      throw new InvalidAreaError(
        `Allocated area must be at least ${MINIMUM_ALLOCATED_AREA}`,
      );
    }
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
