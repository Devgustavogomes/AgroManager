import { describe, it, expect } from 'vitest';
import { Crop } from './crop.entity';
import { Area } from 'src/shared/domain/value-objects/area';
import { InvalidAreaError } from 'src/shared/domain/errors/invalidAreaError';
import { CropStatus } from '../constants/crop-status.enum';
import { PestStatus } from '../constants/pest-status.enum';

describe('Crop Entity', () => {
  const validProps = {
    cultureId: 'culture-123',
    name: 'Safra de Milho',
    status: CropStatus.PLANNED,
    allocatedArea: Area.create(50),
    plantingDate: new Date('2023-01-01'),
    harvestDateExpected: new Date('2023-06-01'),
    pestStatus: PestStatus.NONE,
    cropId: 'test-id',
  };

  it('Should create a crop successfully with default values', () => {
    const crop = Crop.create(validProps);

    expect(crop.name).toBe(validProps.name);
    expect(crop.status).toBe(validProps.status);
    expect(crop.allocatedArea.getValue).toBe(validProps.allocatedArea.getValue);
    expect(crop.plantingDate).toBe(validProps.plantingDate);
    expect(crop.harvestDateExpected).toBe(validProps.harvestDateExpected);
    expect(crop.pestStatus).toBe(validProps.pestStatus);

    expect(crop.cropId).toBe('test-id');
    expect(crop.harvestDateActual).toBeNull();
    expect(crop.createdAt).toBeInstanceOf(Date);
    expect(crop.updatedAt).toBeNull();
  });

  it('Should create a crop with provided optional values', () => {
    const customDate = new Date('2023-01-01');
    const harvestActual = new Date('2023-05-20');
    const crop = Crop.create({
      ...validProps,
      cropId: 'custom-id',
      harvestDateActual: harvestActual,
      createdAt: customDate,
    });

    expect(crop.cropId).toBe('custom-id');
    expect(crop.harvestDateActual).toEqual(harvestActual);
    expect(crop.createdAt).toEqual(customDate);
  });

  it('Should emit a crop.created domain event upon creation', () => {
    const crop = Crop.create(validProps);
    const events = crop.getDomainEvents();

    expect(events).toHaveLength(1);
    expect(events[0].event).toBe('crop.created');
    expect(events[0].data.cropName).toBe('Safra de Milho');
  });

  it('Should throw InvalidAreaError if allocated area is less than minimum', () => {
    expect(() => {
      Crop.create({
        ...validProps,
        allocatedArea: Area.create(0),
      });
    }).toThrow(InvalidAreaError);
  });

  it('Should update crop fields and touch updatedAt', () => {
    const crop = Crop.create(validProps);
    crop.clearDomainEvents();

    crop.update({
      name: 'Safra de Soja',
      status: CropStatus.HARVESTED,
      allocatedArea: Area.create(60),
      pestStatus: PestStatus.HIGH,
    });

    expect(crop.name).toBe('Safra de Soja');
    expect(crop.status).toBe(CropStatus.HARVESTED);
    expect(crop.allocatedArea.getValue).toBe(60);
    expect(crop.pestStatus).toBe(PestStatus.HIGH);
    expect(crop.updatedAt).toBeInstanceOf(Date);

    const events = crop.getDomainEvents();
    expect(events).toHaveLength(1);
    expect(events[0].event).toBe('crop.updated');
    expect(events[0].data.cropName).toBe('Safra de Soja');
  });

  it('Should reconstitute an existing crop without triggering creation events', () => {
    const props = {
      ...validProps,
      cropId: 'crop-123',
      harvestDateActual: null,
      createdAt: new Date('2023-01-01'),
      updatedAt: null,
    };

    const crop = Crop.reconstitute(props);

    expect(crop.cropId).toBe('crop-123');
    expect(crop.name).toBe('Safra de Milho');
    expect(crop.getDomainEvents()).toHaveLength(0);
  });
});
