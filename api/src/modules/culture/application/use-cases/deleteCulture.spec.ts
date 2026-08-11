import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DeleteCultureUseCase } from './deleteCulture';
import { CultureContract } from '../../domain/repositories/cultureRepository.contract';
import { Mocked } from 'vitest';

describe('DeleteCultureUseCase', () => {
  let mockCultureRepository: Mocked<CultureContract>;
  let useCase: DeleteCultureUseCase;

  beforeEach(() => {
    mockCultureRepository = {
      delete: vi.fn(),
    } as unknown as Mocked<CultureContract>;

    useCase = new DeleteCultureUseCase(mockCultureRepository);
  });

  it('Should successfully delete a culture by id', async () => {
    const cultureId = 'culture-123';
    mockCultureRepository.delete.mockResolvedValueOnce();

    await useCase.execute(cultureId);

    expect(mockCultureRepository.delete).toHaveBeenCalledOnce();
    expect(mockCultureRepository.delete).toHaveBeenCalledWith(cultureId);
  });
});
