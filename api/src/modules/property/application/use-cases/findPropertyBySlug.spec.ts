import { Mocked } from 'vitest';
import { FindBySlugUseCase } from './findPropertyBySlug';
import { PropertyContract } from '../../domain/repositories/propertyRepository.contract';
import { NotFoundError } from 'src/shared/domain/errors/notFoundError';
import { makeFakeProperty } from 'test/factories/makeProperty';

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
    const property = makeFakeProperty();

    mockRepository.findBySlug.mockResolvedValue(property);

    await useCase.execute('slug', 'producer-id');

    expect(mockRepository.findBySlug).toHaveBeenCalledOnce();
    expect(mockRepository.findBySlug).toHaveBeenCalledWith(
      'slug',
      'producer-id',
    );
  });
  it('Should thrown a NotFoundError if property doesnt exist', async () => {
    mockRepository.findBySlug.mockResolvedValue(undefined);

    await expect(useCase.execute('slug', 'producer-id')).rejects.toThrow(
      NotFoundError,
    );
  });
});
