import { FindByIdCultureUseCase } from './findById';
import { CultureContract } from '../../domain/repositories/cultureRepository.contract';
import { Culture } from '../../domain/entities/culture.entity';
import { Area } from 'src/shared/domain/value-objects/area';
import { NotFoundError } from 'src/shared/domain/errors/notFoundError';
import { Mocked, vi } from 'vitest';

describe('FindByIdCultureUseCase', () => {
  let mockCultureRepository: Mocked<CultureContract>;
  let useCase: FindByIdCultureUseCase;

  beforeEach(() => {
    mockCultureRepository = {
      findById: vi.fn(),
    } as unknown as Mocked<CultureContract>;

    useCase = new FindByIdCultureUseCase(mockCultureRepository);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('Should find a Culture by ID and return mapped output', async () => {
    const cultureId = 'culture-123';
    const createdAt = new Date('2026-07-31T12:00:00Z');

    const mockCulture = Culture.reconstitute({
      cultureId,
      propertyId: 'prop-1',
      name: 'Corn',
      allocatedArea: Area.create(50),
      createdAt,
      updatedAt: null,
    });

    mockCultureRepository.findById.mockResolvedValueOnce(mockCulture);

    const result = await useCase.execute(cultureId);

    expect(mockCultureRepository.findById).toHaveBeenCalledWith(cultureId);
    expect(mockCultureRepository.findById).toHaveBeenCalledOnce();

    expect(result).toEqual({
      cultureId,
      propertyId: 'prop-1',
      name: 'Corn',
      allocatedArea: 50,
      createdAt: createdAt.toISOString(),
      updatedAt: null,
    });
  });

  it('Should throw NotFoundError if Culture is not found', async () => {
    const cultureId = 'culture-not-found';

    mockCultureRepository.findById.mockResolvedValueOnce(
      null as unknown as Culture,
    );

    await expect(useCase.execute(cultureId)).rejects.toThrow(NotFoundError);
    await expect(useCase.execute(cultureId)).rejects.toThrow(
      'Culture not found',
    );

    expect(mockCultureRepository.findById).toHaveBeenCalledWith(cultureId);
  });
});
