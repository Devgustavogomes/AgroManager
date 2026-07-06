import { Mocked } from 'vitest';
import { CropContract } from '../../domain/repositories/cropsRepository.contract';
import { CreateCropUseCase } from './createCrop';
import { PestStatus } from '../../domain/constants/pest-status.enum';
import { CropStatus } from '../../domain/constants/crop-status.enum';
import { Crop } from '../../domain/entities/crop.entity';
import { DatabaseContract } from '@agromanager/infra/database/contract';
import { Area } from 'src/shared/domain/value-objects/area';

describe('CreateCropUseCase', () => {
  let mockCropRepository: Mocked<CropContract>;
  let mockDatabaseService: Mocked<DatabaseContract>;
  let useCase: CreateCropUseCase;

  beforeAll(() => {
    mockCropRepository = {
      create: vi.fn(),
      getCultureArea: vi.fn(),
      getCropsArea: vi.fn(),
    } as unknown as Mocked<CropContract>;

    mockDatabaseService = {
      transaction: vi.fn().mockImplementation((callback: any) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return callback({});
      }),
    } as unknown as Mocked<DatabaseContract>;
    useCase = new CreateCropUseCase(mockCropRepository, mockDatabaseService);
  });

  it('should create a new crop successfully', async () => {
    const cultureId = '1';
    const dto = {
      name: 'crop1',
      status: CropStatus.READY,
      allocatedArea: 11,
      plantingDate: '2022-01-01',
      harvestDateExpected: '2022-12-31',
      harvestDateActual: null,
      pestStatus: PestStatus.NONE,
    };

    const crop = Crop.create({
      ...dto,
      cultureId,
      allocatedArea: Area.create(dto.allocatedArea),
      plantingDate: new Date(dto.plantingDate),
      harvestDateExpected: new Date(dto.harvestDateExpected),
      harvestDateActual: null,
    });

    mockCropRepository.getCultureArea.mockResolvedValueOnce(20);
    mockCropRepository.getCropsArea.mockResolvedValueOnce(0);
    mockCropRepository.create.mockResolvedValue(crop);

    await useCase.execute(cultureId, dto);

    expect(mockDatabaseService.transaction).toHaveBeenCalled();
    expect(mockCropRepository.getCultureArea).toHaveBeenCalledWith(
      crop.cultureId,
      expect.any(Object),
    );
    expect(mockCropRepository.create).toHaveBeenCalledTimes(1);
    expect(mockCropRepository.create).toHaveBeenCalledWith(
      expect.any(Crop),
      expect.any(Object),
    );
  });
});
