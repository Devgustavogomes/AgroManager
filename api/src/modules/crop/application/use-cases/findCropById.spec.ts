import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FindCropByIdUseCase } from './findCropById';
import { CropContract } from '../../domain/repositories/cropsRepository.contract';
import { Mocked } from 'vitest';
import { makeFakeCrop } from '../../../../../test/factories/makeCrop';
import { NotFoundError } from 'src/shared/domain/errors/notFoundError';
import { CropMapper } from '../../infrastructure/crop.mapper';

describe('FindCropByIdUseCase', () => {
  let mockCropRepository: Mocked<CropContract>;
  let useCase: FindCropByIdUseCase;

  beforeEach(() => {
    mockCropRepository = {
      findById: vi.fn(),
    } as unknown as Mocked<CropContract>;

    useCase = new FindCropByIdUseCase(mockCropRepository);
  });

  it('Should return a mapped crop successfully', async () => {
    const cropId = 'crop-123';
    const fakeCrop = makeFakeCrop({ cropId });
    mockCropRepository.findById.mockResolvedValueOnce(fakeCrop);

    const result = await useCase.execute(cropId);

    expect(mockCropRepository.findById).toHaveBeenCalledOnce();
    expect(mockCropRepository.findById).toHaveBeenCalledWith(cropId);

    const mapped = CropMapper.toResponse([fakeCrop])[0];
    expect(result).toEqual(mapped);
  });

  it('Should throw NotFoundError if repository returns falsy value', async () => {
    const cropId = 'crop-123';
    mockCropRepository.findById.mockResolvedValueOnce(null as any);

    await expect(useCase.execute(cropId)).rejects.toThrow(NotFoundError);
    await expect(useCase.execute(cropId)).rejects.toThrow('Crop not found');
  });
});
