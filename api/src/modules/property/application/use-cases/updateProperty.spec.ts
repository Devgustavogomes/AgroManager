import { Mocked } from 'vitest';
import { PropertyContract } from '../../domain/repositories/propertyRepository.contract';
import { UpdatePropertyUseCase } from './updateProperty';
import { Property } from '../../domain/entities/property.entity';
import { EventEmitterContract } from 'src/shared/domain/providers/emitterProvider.contract';
import { makeFakeProperty } from 'test/factories/makeProperty';
import { PropertyMapper } from '../../infrastructure/property.mapper';
import { NotFoundError } from 'src/shared/domain/errors/notFoundError';

describe('Update Property', () => {
  let useCase: UpdatePropertyUseCase;
  let mockRepository: Mocked<PropertyContract>;
  let mockEventEmitter: Mocked<EventEmitterContract>;

  beforeEach(() => {
    mockRepository = {
      count: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
      findBySlug: vi.fn(),
      update: vi.fn(),
      isOwner: vi.fn(),
    };

    mockEventEmitter = {
      emit: vi.fn(),
    };

    useCase = new UpdatePropertyUseCase(mockRepository, mockEventEmitter);
  });

  it('Should update a property succesfully', async () => {
    const dto = {
      name: 'New Name',
    };

    const property = makeFakeProperty();

    mockRepository.findBySlug.mockResolvedValue(property);

    mockRepository.update.mockResolvedValue(property);

    const propertyUpdate = vi.spyOn(Property.prototype, 'update');

    const getDomainEventsSpy = vi.spyOn(Property.prototype, 'getDomainEvents');

    const clearEventsSpy = vi.spyOn(Property.prototype, 'clearDomainEvents');

    const propertyMapper = vi.spyOn(PropertyMapper, 'toResponse');

    await useCase.execute('slug', 'producer-123', dto);

    expect(mockRepository.findBySlug).toHaveBeenCalledWith(
      'slug',
      'producer-123',
    );

    expect(propertyUpdate).toHaveBeenCalledOnce();

    expect(mockRepository.update).toHaveBeenCalledWith(
      'producer-123',
      expect.any(Property),
    );

    expect(getDomainEventsSpy).toHaveBeenCalledOnce();

    expect(mockEventEmitter.emit).toHaveBeenCalled();

    expect(clearEventsSpy).toHaveBeenCalledOnce();

    expect(propertyMapper).toHaveBeenCalledOnce();
  });
  it('Should thrown a NotFoundError if property doesnt exist', async () => {
    mockRepository.findBySlug.mockResolvedValue(undefined);

    await expect(useCase.execute('slug', 'producer-id', {})).rejects.toThrow(
      NotFoundError,
    );
  });
});
