import { DatabaseContract } from '@agromanager/infra/database/contract';
import { CropContract } from '../../domain/repositories/cropsRepository.contract';
import { UpdateCropUseCase } from './updateCrop';
import { Mocked } from 'vitest';
import { CropStatus } from '../../domain/constants/crop-status.enum';
import { PestStatus } from '../../domain/constants/pest-status.enum';
import { Crop } from '../../domain/entities/crop.entity';
import { Area } from 'src/shared/domain/value-object/area';

describe('UpdateCropUseCase', () => {
  let mockCropRepository: Mocked<CropContract>;
  let mockDatabaseService: Mocked<DatabaseContract>;
  let useCase: UpdateCropUseCase;

  beforeAll(() => {
    mockCropRepository = {
      findById: vi.fn(),
      getCultureArea: vi.fn(),
      getCropsArea: vi.fn(),
      update: vi.fn(),
    } as unknown as Mocked<CropContract>;

    mockDatabaseService = {
      transaction: vi.fn().mockImplementation((callback: any) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return callback({});
      }),
    } as unknown as Mocked<DatabaseContract>;
    useCase = new UpdateCropUseCase(mockCropRepository, mockDatabaseService);
  });

  it('should update a crop successfully', async () => {
    const cultureId = '1';
    const cropId = '1';
    const dto = {
      name: 'crop1',
      status: CropStatus.READY,
      allocatedArea: 20,
      plantingDate: '2022-01-01',
      harvestDateExpected: '2022-12-31',
      harvestDateActual: null,
      pestStatus: PestStatus.NONE,
    };

    const crop = Crop.create({
      ...dto,
      cultureId,
      cropId,
      allocatedArea: Area.create(dto.allocatedArea),
      plantingDate: new Date(dto.plantingDate),
      harvestDateExpected: new Date(dto.harvestDateExpected),
      harvestDateActual: null,
    });

    mockCropRepository.findById.mockResolvedValueOnce(crop);
    mockCropRepository.getCultureArea.mockResolvedValueOnce(20);
    mockCropRepository.getCropsArea.mockResolvedValueOnce(0);
    mockCropRepository.update.mockResolvedValueOnce(crop);

    await useCase.execute(cropId, cultureId, dto);

    expect(mockDatabaseService.transaction).toHaveBeenCalled();
    expect(mockCropRepository.findById).toHaveBeenCalledWith(
      cropId,
      expect.any(Object),
    );
    expect(mockCropRepository.getCultureArea).toHaveBeenCalledWith(
      crop.cultureId,
      expect.any(Object),
    );
    expect(mockCropRepository.update).toHaveBeenCalledTimes(1);
    expect(mockCropRepository.update).toHaveBeenCalledWith(
      expect.any(Crop),
      expect.any(Object),
    );
  });
});
