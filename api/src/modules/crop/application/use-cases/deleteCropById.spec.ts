import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DeleteCropByIdUseCase } from './deleteCropById';
import { CropContract } from '../../domain/repositories/cropsRepository.contract';
import { Mocked } from 'vitest';

describe('DeleteCropByIdUseCase', () => {
  let mockCropRepository: Mocked<CropContract>;
  let useCase: DeleteCropByIdUseCase;

  beforeEach(() => {
    mockCropRepository = {
      deleteById: vi.fn(),
    } as unknown as Mocked<CropContract>;

    useCase = new DeleteCropByIdUseCase(mockCropRepository);
  });

  it('Should successfully delete a crop by id', async () => {
    const cropId = 'crop-123';
    mockCropRepository.deleteById.mockResolvedValueOnce();

    await useCase.execute(cropId);

    expect(mockCropRepository.deleteById).toHaveBeenCalledOnce();
    expect(mockCropRepository.deleteById).toHaveBeenCalledWith(cropId);
  });
});
