import { Mocked } from 'vitest';
import { PropertyContract } from '../../domain/repositories/property-repository.interface';
import { UpdatePropertyUseCase } from './update-property';
import { PropertyEntity } from '../../domain/entities/property.entity';
import { Area } from 'src/shared/domain/value-object/area';

describe('Update Property', () => {
  let useCase: UpdatePropertyUseCase;
  let mockRepository: Mocked<PropertyContract>;

  beforeEach(() => {
    mockRepository = {
      count: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
      findBySlug: vi.fn(),
      update: vi.fn(),
    };

    useCase = new UpdatePropertyUseCase(mockRepository);
  });

  it('Should update a property succesfully', async () => {
    const dto = {
      name: 'New Name',
    };
    const propertyMock = PropertyEntity.create({
      arableArea: Area.create(60),
      city: 'City',
      name: 'Name',
      producerId: '123',
      state: 'State',
      totalArea: Area.create(120),
      vegetationArea: Area.create(60),
    });

    mockRepository.findBySlug.mockResolvedValue(propertyMock);

    propertyMock.changeName = dto.name;

    mockRepository.update.mockResolvedValue(propertyMock);

    const result = await useCase.execute('slug', 'producer-123', dto);

    expect(mockRepository.findBySlug).toHaveBeenCalledOnce();
    expect(mockRepository.findBySlug).toHaveBeenCalledWith(
      'slug',
      'producer-123',
    );
    expect(mockRepository.update).toHaveBeenCalledOnce();
    expect(mockRepository.update).toHaveBeenCalledWith(
      'slug',
      'producer-123',
      propertyMock,
    );
    expect(result.getName).toBe(dto.name);
    expect(result.getSlug).toBe('new-name');
  });
});
