import { describe, it, expect, vi, beforeEach } from 'vitest';
import { IsCultureOwnerUseCase } from './isCultureOwner';
import { CultureContract } from '../../domain/repositories/cultureRepository.contract';
import { Mocked } from 'vitest';

describe('IsCultureOwnerUseCase', () => {
  let mockCultureRepository: Mocked<CultureContract>;
  let useCase: IsCultureOwnerUseCase;

  beforeEach(() => {
    mockCultureRepository = {
      isOwner: vi.fn(),
    } as unknown as Mocked<CultureContract>;

    useCase = new IsCultureOwnerUseCase(mockCultureRepository);
  });

  it('Should return true if producer is the owner of the culture', async () => {
    const producerId = 'producer-123';
    const cultureId = 'culture-456';
    mockCultureRepository.isOwner.mockResolvedValueOnce(true);

    const result = await useCase.execute(producerId, cultureId);

    expect(mockCultureRepository.isOwner).toHaveBeenCalledOnce();
    expect(mockCultureRepository.isOwner).toHaveBeenCalledWith(
      producerId,
      cultureId,
    );
    expect(result).toBe(true);
  });

  it('Should return false if producer is not the owner of the culture', async () => {
    const producerId = 'producer-123';
    const cultureId = 'culture-456';
    mockCultureRepository.isOwner.mockResolvedValueOnce(false);

    const result = await useCase.execute(producerId, cultureId);

    expect(mockCultureRepository.isOwner).toHaveBeenCalledOnce();
    expect(mockCultureRepository.isOwner).toHaveBeenCalledWith(
      producerId,
      cultureId,
    );
    expect(result).toBe(false);
  });
});
