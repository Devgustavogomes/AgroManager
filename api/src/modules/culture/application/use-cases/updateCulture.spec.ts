import { Mocked } from 'vitest';
import { CultureContract } from '../../domain/repositories/cultureRepository.interface';
import { UpdateCultureUseCase } from './updateCulture';
import { DatabaseContract } from '@agromanager/infra/database/contract';
import { Culture } from '../../domain/entities/culture.entity';
import { Area } from 'src/shared/domain/value-objects/area';
import { InvalidAreaError } from 'src/shared/domain/errors/invalidAreaError';

describe('UpdateCultureUseCase', () => {
  let useCase: UpdateCultureUseCase;
  let mockCultureRepository: Mocked<CultureContract>;
  let mockDatabaseService: Mocked<DatabaseContract>;

  beforeEach(() => {
    mockCultureRepository = {
      update: vi.fn(),
      findById: vi.fn(),
      cropSum: vi.fn(),
    } as unknown as Mocked<CultureContract>;

    mockDatabaseService = {
      transaction: vi.fn().mockImplementation((callback: any) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return callback({});
      }),
    } as unknown as Mocked<DatabaseContract>;

    useCase = new UpdateCultureUseCase(
      mockCultureRepository,
      mockDatabaseService,
    );
  });

  it('Should update a culture successfully', async () => {
    const dto = {
      name: 'new name',
      allocatedArea: 100,
    };

    const culture = Culture.create({
      allocatedArea: Area.create(40),
      name: 'test',
      propertyId: '1',
    });

    mockCultureRepository.findById.mockResolvedValue(culture);
    mockCultureRepository.cropSum.mockResolvedValue(0);
    mockCultureRepository.update.mockResolvedValue(culture);

    await useCase.execute('1', dto);

    expect(mockCultureRepository.update).toHaveBeenCalledWith(
      expect.objectContaining({
        props: expect.objectContaining({
          name: dto.name,
          allocatedArea: Area.create(dto.allocatedArea),
        }),
      }),
      expect.any(Object),
    );
    expect(mockCultureRepository.cropSum).toHaveBeenCalledWith(
      '1',
      expect.any(Object),
    );
    expect(mockCultureRepository.findById).toHaveBeenCalledWith(
      '1',
      expect.any(Object),
    );
    expect(mockDatabaseService.transaction).toHaveBeenCalled();
  });
  it('Should throw a InvalidAreaError if the sum of crops is greater than the allocated area', async () => {
    const dto = {
      name: 'new name',
      allocatedArea: 100,
    };

    const culture = Culture.create({
      allocatedArea: Area.create(120),
      name: 'test',
      propertyId: '1',
    });

    mockCultureRepository.findById.mockResolvedValue(culture);
    mockCultureRepository.cropSum.mockResolvedValue(110);

    await expect(useCase.execute('1', dto)).rejects.toThrow(InvalidAreaError);
  });
});
