import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DeleteCropByCultureUseCase } from './deleteCropByCulture';
import { CropContract } from '../../domain/repositories/cropsRepository.contract';
import { Mocked } from 'vitest';

describe('DeleteCropByCultureUseCase', () => {
  let mockCropRepository: Mocked<CropContract>;
  let useCase: DeleteCropByCultureUseCase;

  beforeEach(() => {
    mockCropRepository = {
      deleteByCulture: vi.fn(),
    } as unknown as Mocked<CropContract>;

    useCase = new DeleteCropByCultureUseCase(mockCropRepository);
  });

  it('Should successfully delete crops by culture id', async () => {
    const cultureId = 'culture-123';
    mockCropRepository.deleteByCulture.mockResolvedValueOnce();

    await useCase.execute(cultureId);

    expect(mockCropRepository.deleteByCulture).toHaveBeenCalledOnce();
    expect(mockCropRepository.deleteByCulture).toHaveBeenCalledWith(cultureId);
  });
});
