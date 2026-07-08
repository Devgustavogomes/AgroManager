import { Mocked } from 'vitest';
import { PropertyContract } from '../../domain/repositories/propertyRepository.contract';
import { UpdatePropertyUseCase } from './updateProperty';
import { Property } from '../../domain/entities/property.entity';
import { Area } from 'src/shared/domain/value-objects/area';
import { EventEmitterContract } from 'src/shared/domain/providers/emitterProvider.contract';

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
    const propertyMock = Property.create({
      arableArea: Area.create(60),
      city: 'City',
      name: 'Name',
      producerId: '123',
      state: 'State',
      totalArea: Area.create(120),
      vegetationArea: Area.create(60),
    });

    mockRepository.findBySlug.mockResolvedValue(propertyMock);

    mockRepository.update.mockResolvedValue(propertyMock);

    await useCase.execute('slug', 'producer-123', dto);

    expect(mockRepository.findBySlug).toHaveBeenCalledOnce();
    expect(mockRepository.findBySlug).toHaveBeenCalledWith(
      'slug',
      'producer-123',
    );
    expect(mockRepository.update).toHaveBeenCalledOnce();
    expect(mockRepository.update).toHaveBeenCalledWith(
      'producer-123',
      propertyMock,
    );
  });
});
