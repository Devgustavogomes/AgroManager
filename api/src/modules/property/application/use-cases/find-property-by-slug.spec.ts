import { Mocked } from 'vitest';
import { FindBySlugUseCase } from './find-property-by-slug';
import { PropertyContract } from '../../domain/repositories/property-repository.interface';
import { PropertyEntity } from '../../domain/entities/property.entity';
import { Area } from 'src/shared/domain/value-object/area';
import { NotFoundException } from '@nestjs/common';

describe('Find property by Slug', () => {
  let useCase: FindBySlugUseCase;
  let mockRepository: Mocked<PropertyContract>;

  beforeEach(() => {
    mockRepository = {
      count: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
      findBySlug: vi.fn(),
      update: vi.fn(),
      isOwner: vi.fn(),
    };

    useCase = new FindBySlugUseCase(mockRepository);
  });

  it('Should find property by slug successfully', async () => {
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

    const result = await useCase.execute('slug', 'producer-id');

    expect(result).toBeDefined();
    expect(mockRepository.findBySlug).toHaveBeenCalledOnce();
    expect(mockRepository.findBySlug).toHaveBeenCalledWith(
      'slug',
      'producer-id',
    );
  });
  it('Should thrown a NotFoundException if property doesnt exist', async () => {
    mockRepository.findBySlug.mockResolvedValue(undefined);

    await expect(useCase.execute('slug', 'producer-id')).rejects.toThrow(
      NotFoundException,
    );
  });
});
