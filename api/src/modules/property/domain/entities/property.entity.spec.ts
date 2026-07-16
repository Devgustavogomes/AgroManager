import { describe, it, expect } from 'vitest';
import { Property } from './property.entity';
import { Area } from '../../../../shared/domain/value-objects/area';
import { Slug } from '../value-object/slug';
import { InvalidAreaError } from 'src/shared/domain/errors/invalidAreaError';

describe('Property Entity', () => {
  const validProps = {
    producerId: 'producer-123',
    name: 'Fazenda do Sol',
    city: 'São Paulo',
    state: 'SP',
    totalArea: Area.create(100),
    arableArea: Area.create(60),
    vegetationArea: Area.create(40),
  };

  it('Should create a property successfully and generate a slug', () => {
    const property = Property.create(validProps);

    expect(property.producerId).toBe(validProps.producerId);
    expect(property.name).toBe(validProps.name);
    expect(property.city).toBe(validProps.city);
    expect(property.state).toBe(validProps.state);
    expect(property.totalArea).toBe(100);
    expect(property.arableArea).toBe(60);
    expect(property.vegetationArea).toBe(40);

    expect(property.slug).toBe('fazenda-do-sol');
    expect(property.createdAt).toBeInstanceOf(Date);
    expect(property.updatedAt).toBeNull();
  });

  it('Should emit a property.created domain event upon creation', () => {
    const property = Property.create(validProps);
    const events = property.getDomainEvents('');

    expect(events).toHaveLength(1);
    expect(events[0].event).toBe('property.created');
  });

  it('Should throw InvalidAreaError if arable + vegetation area exceeds total area', () => {
    expect(() => {
      Property.create({
        ...validProps,
        totalArea: Area.create(100),
        arableArea: Area.create(60),
        vegetationArea: Area.create(50),
      });
    }).toThrow(InvalidAreaError);
  });

  it('Should update property fields and touch updatedAt', () => {
    const property = Property.create(validProps);
    property.clearDomainEvents();

    property.update({
      name: 'Fazenda Nova',
      city: 'Rio de Janeiro',
    });

    expect(property.name).toBe('Fazenda Nova');
    expect(property.city).toBe('Rio de Janeiro');
    expect(property.slug).toBe('fazenda-nova');
    expect(property.updatedAt).toBeInstanceOf(Date);

    const events = property.getDomainEvents('');
    expect(events).toHaveLength(1);
    expect(events[0].event).toBe('property.updated');
  });

  it('Should validate areas again when updating area fields', () => {
    const property = Property.create(validProps);

    expect(() => {
      property.update({
        arableArea: Area.create(70),
      });
    }).toThrow(InvalidAreaError);
  });

  it('Should reconstitute an existing property without triggering creation events', () => {
    const props = {
      ...validProps,
      propertyId: 'prop-123',
      slug: Slug.createFromText('fazenda-reconstituida'),
      createdAt: new Date('2023-01-01'),
      updatedAt: null,
    };

    const property = Property.reconstitute(props);

    expect(property.propertyId).toBe('prop-123');
    expect(property.slug).toBe('fazenda-reconstituida');
    expect(property.getDomainEvents('')).toHaveLength(0);
  });
});
