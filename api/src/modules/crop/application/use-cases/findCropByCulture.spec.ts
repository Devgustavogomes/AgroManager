import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FindCropByCultureUseCase } from './findCropByCulture';
import { CropContract } from '../../domain/repositories/cropsRepository.contract';
import { Mocked } from 'vitest';
import { makeFakeCrop } from '../../../../../test/factories/makeCrop';
import { NotFoundError } from 'src/shared/domain/errors/notFoundError';
import { CropMapper } from '../../infrastructure/crop.mapper';

describe('FindCropByCultureUseCase', () => {
  let mockCropRepository: Mocked<CropContract>;
  let useCase: FindCropByCultureUseCase;

  beforeEach(() => {
    mockCropRepository = {
      findByCulture: vi.fn(),
    } as unknown as Mocked<CropContract>;

    useCase = new FindCropByCultureUseCase(mockCropRepository);
  });

  it('Should return mapped crops successfully', async () => {
    const cultureId = 'culture-123';
    const fakeCrop = makeFakeCrop({ cultureId });
    mockCropRepository.findByCulture.mockResolvedValueOnce([fakeCrop]);

    const result = await useCase.execute(cultureId);

    expect(mockCropRepository.findByCulture).toHaveBeenCalledOnce();
    expect(mockCropRepository.findByCulture).toHaveBeenCalledWith(cultureId);

    // Validating basic mapping expectations
    const mapped = CropMapper.toResponse([fakeCrop]);
    expect(result).toEqual(mapped);
  });

  it('Should throw NotFoundError if repository returns falsy value', async () => {
    const cultureId = 'culture-123';
    mockCropRepository.findByCulture.mockResolvedValueOnce(null as any);

    await expect(useCase.execute(cultureId)).rejects.toThrow(NotFoundError);
    await expect(useCase.execute(cultureId)).rejects.toThrow('Crop not found');
  });
});
