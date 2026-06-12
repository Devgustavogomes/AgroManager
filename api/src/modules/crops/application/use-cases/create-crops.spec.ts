import { Mocked } from 'vitest';
import { CropContract } from '../../domain/repositories/crops-repository.contract';
import { CreateCropUseCase } from './createCrops';
import { PestStatus } from '../../domain/constants/pest-status';
import { CropStatus } from '../../domain/constants/crop-status.enum';
import { Crop } from '../../domain/entities/crop.entity';
import { DatabaseService } from 'src/infra/database/service';

describe('CreateCropUseCase', () => {
  let mockCropRepository: Mocked<CropContract>;
  let mockDatabaseService: Mocked<DatabaseService>;
  let useCase: CreateCropUseCase;

  beforeAll(() => {
    mockCropRepository = {
      create: vi.fn(),
      getCultureArea: vi.fn(),
    } as unknown as Mocked<CropContract>;

    mockDatabaseService = {
      transaction: vi.fn().mockImplementation((callback: any) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return callback({});
      }),
    } as unknown as Mocked<DatabaseService>;
    useCase = new CreateCropUseCase(mockCropRepository, mockDatabaseService);
  });

  it('should create a new crop successfully', async () => {
    mockCropRepository.getCultureArea.mockResolvedValueOnce(20);

    const idCulture = '1';
    const dto = {
      name: 'crop1',
      status: CropStatus.READY,
      allocatedArea: 10,
      plantingDate: '2022-01-01',
      harvestDateExpected: '2022-12-31',
      harvestDateActual: null,
      pestStatus: PestStatus.NONE,
    };

    await useCase.execute(idCulture, dto);

    expect(mockDatabaseService.transaction).toHaveBeenCalled();
    expect(mockCropRepository.getCultureArea).toHaveBeenCalledWith(
      idCulture,
      expect.any(Object),
    );
    expect(mockCropRepository.create).toHaveBeenCalledTimes(1);
    expect(mockCropRepository.create).toHaveBeenCalledWith(
      idCulture,
      expect.any(Crop),
      expect.any(Object),
    );
  });
});
