import { describe, it, expect } from 'vitest';
import { Culture } from './culture.entity';
import { Area } from 'src/shared/domain/value-objects/area';
import { InvalidAreaError } from 'src/shared/domain/errors/invalidAreaError';

describe('Culture Entity', () => {
  const validProps = {
    name: 'Milho',
    allocatedArea: Area.create(50),
    propertyId: 'property-123',
    cultureId: 'test-id',
  };

  it('Should create a culture successfully with default values', () => {
    const culture = Culture.create(validProps);

    expect(culture.name).toBe(validProps.name);
    expect(culture.allocatedArea.getValue).toBe(
      validProps.allocatedArea.getValue,
    );
    expect(culture.propertyId).toBe(validProps.propertyId);

    expect(culture.cultureId).toBe('test-id');
    expect(culture.createdAt).toBeInstanceOf(Date);
    expect(culture.updatedAt).toBeNull();
  });

  it('Should create a culture with provided optional values', () => {
    const customDate = new Date('2023-01-01');
    const culture = Culture.create({
      ...validProps,
      cultureId: 'custom-id',
      createdAt: customDate,
    });

    expect(culture.cultureId).toBe('custom-id');
    expect(culture.createdAt).toEqual(customDate);
  });

  it('Should emit a culture.created domain event upon creation', () => {
    const culture = Culture.create(validProps);
    const events = culture.getDomainEvents();

    expect(events).toHaveLength(1);
    expect(events[0].event).toBe('culture.created');
    expect(events[0].data.cultureName).toBe('Milho');
  });

  it('Should throw InvalidAreaError if allocated area is less than minimum', () => {
    expect(() => {
      Culture.create({
        ...validProps,
        allocatedArea: Area.create(0),
      });
    }).toThrow(InvalidAreaError);
  });

  it('Should update culture fields and touch updatedAt', () => {
    const culture = Culture.create(validProps);
    culture.clearDomainEvents();

    culture.update({
      name: 'Soja',
      allocatedArea: Area.create(60),
    });

    expect(culture.name).toBe('Soja');
    expect(culture.allocatedArea.getValue).toBe(60);
    expect(culture.updatedAt).toBeInstanceOf(Date);

    const events = culture.getDomainEvents();
    expect(events).toHaveLength(1);
    expect(events[0].event).toBe('culture.updated');
    expect(events[0].data.cultureName).toBe('Soja');
  });

  it('Should reconstitute an existing culture without triggering creation events', () => {
    const props = {
      ...validProps,
      cultureId: 'culture-123',
      createdAt: new Date('2023-01-01'),
      updatedAt: null,
    };

    const culture = Culture.reconstitute(props);

    expect(culture.cultureId).toBe('culture-123');
    expect(culture.name).toBe('Milho');
    expect(culture.getDomainEvents()).toHaveLength(0);
  });
});
