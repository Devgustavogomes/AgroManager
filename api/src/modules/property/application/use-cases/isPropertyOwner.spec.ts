import { describe, it, expect, vi, beforeEach } from 'vitest';
import { IsPropertyOwnerUseCase } from './isPropertyOwner';
import { PropertyContract } from '../../domain/repositories/propertyRepository.contract';
import { Mocked } from 'vitest';

describe('IsPropertyOwnerUseCase', () => {
  let mockPropertyRepository: Mocked<PropertyContract>;
  let useCase: IsPropertyOwnerUseCase;

  beforeEach(() => {
    mockPropertyRepository = {
      isOwner: vi.fn(),
    } as unknown as Mocked<PropertyContract>;

    useCase = new IsPropertyOwnerUseCase(mockPropertyRepository);
  });

  it('Should return true if producer is the owner of the property', async () => {
    const producerId = 'producer-123';
    const propertyId = 'property-456';
    mockPropertyRepository.isOwner.mockResolvedValueOnce(true);

    const result = await useCase.execute(producerId, propertyId);

    expect(mockPropertyRepository.isOwner).toHaveBeenCalledOnce();
    expect(mockPropertyRepository.isOwner).toHaveBeenCalledWith(
      producerId,
      propertyId,
    );
    expect(result).toBe(true);
  });

  it('Should return false if producer is not the owner of the property', async () => {
    const producerId = 'producer-123';
    const propertyId = 'property-456';
    mockPropertyRepository.isOwner.mockResolvedValueOnce(false);

    const result = await useCase.execute(producerId, propertyId);

    expect(mockPropertyRepository.isOwner).toHaveBeenCalledOnce();
    expect(mockPropertyRepository.isOwner).toHaveBeenCalledWith(
      producerId,
      propertyId,
    );
    expect(result).toBe(false);
  });
});
