import { describe, it, expect, vi, beforeEach } from 'vitest';
import { IsCropOwnerUseCase } from './isCropOwner';
import { CropContract } from '../../domain/repositories/cropsRepository.contract';
import { Mocked } from 'vitest';

describe('IsCropOwnerUseCase', () => {
  let mockCropRepository: Mocked<CropContract>;
  let useCase: IsCropOwnerUseCase;

  beforeEach(() => {
    mockCropRepository = {
      isOwner: vi.fn(),
    } as unknown as Mocked<CropContract>;

    useCase = new IsCropOwnerUseCase(mockCropRepository);
  });

  it('Should return true if producer is the owner of the crop', async () => {
    const producerId = 'producer-123';
    const cropId = 'crop-456';
    mockCropRepository.isOwner.mockResolvedValueOnce(true);

    const result = await useCase.execute(producerId, cropId);

    expect(mockCropRepository.isOwner).toHaveBeenCalledOnce();
    expect(mockCropRepository.isOwner).toHaveBeenCalledWith(producerId, cropId);
    expect(result).toBe(true);
  });

  it('Should return false if producer is not the owner of the crop', async () => {
    const producerId = 'producer-123';
    const cropId = 'crop-456';
    mockCropRepository.isOwner.mockResolvedValueOnce(false);

    const result = await useCase.execute(producerId, cropId);

    expect(mockCropRepository.isOwner).toHaveBeenCalledOnce();
    expect(mockCropRepository.isOwner).toHaveBeenCalledWith(producerId, cropId);
    expect(result).toBe(false);
  });
});
