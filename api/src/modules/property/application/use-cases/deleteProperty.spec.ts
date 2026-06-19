import { Mocked } from 'vitest';
import { PropertyContract } from '../../domain/repositories/propertyRepository.contract';
import { DeletePropertyUseCase } from './deleteProperty';

describe('Delete Property', () => {
  let useCase: DeletePropertyUseCase;
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

    useCase = new DeletePropertyUseCase(mockRepository);
  });
  it('Should delete a property successfully', async () => {
    mockRepository.delete.mockResolvedValue();

    await useCase.execute('slug', 'producer-id');

    expect(mockRepository.delete).toHaveBeenCalledWith('slug', 'producer-id');
    expect(mockRepository.delete).toHaveBeenCalledOnce();
  });
});
