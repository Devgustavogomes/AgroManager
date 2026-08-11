import { CultureContract } from '../../domain/repositories/cultureRepository.contract';
import { Mocked } from 'vitest';
import { DatabaseContract } from '@agromanager/infra/database/contract';
import { EventEmitterContract } from 'src/shared/domain/providers/emitterProvider.contract';
import { CreateCultureUseCase } from './createCulture';
import { Area } from 'src/shared/domain/value-objects/area';
import { Culture } from '../../domain/entities/culture.entity';
import { ValidateCultureAreaService } from '../../domain/services/validateCultureArea.service';
import { IdGeneratorContract } from 'src/shared/domain/providers/idGenerator.contract';

describe('CreateCultureUseCase', () => {
  let mockCultureRepository: Mocked<CultureContract>;
  let mockDatabaseService: Mocked<DatabaseContract>;
  let mockEventEmitter: Mocked<EventEmitterContract>;
  let mockIdGenerator: Mocked<IdGeneratorContract>;
  let useCase: CreateCultureUseCase;

  beforeEach(() => {
    mockCultureRepository = {
      create: vi.fn(),
      findPropertyBySlug: vi.fn(),
      getPropertyArea: vi.fn(),
      cultureAreaSum: vi.fn(),
    } as unknown as Mocked<CultureContract>;

    mockDatabaseService = {
      transaction: vi.fn().mockImplementation((callback: any) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return callback({});
      }),
    } as unknown as Mocked<DatabaseContract>;

    mockEventEmitter = {
      emit: vi.fn(),
    };

    mockIdGenerator = {
      generate: vi.fn().mockReturnValue('test-uuid'),
    };

    useCase = new CreateCultureUseCase(
      mockCultureRepository,
      mockDatabaseService,
      mockEventEmitter,
      mockIdGenerator,
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('Should create a new Culture', async () => {
    const slug = 'property-slug';
    const producerId = 'producer-123';
    const dto = { name: 'Corn', allocatedArea: 20 };

    mockCultureRepository.findPropertyBySlug.mockResolvedValueOnce('prop-1');
    mockCultureRepository.getPropertyArea.mockResolvedValueOnce(
      Area.create(100),
    );
    mockCultureRepository.cultureAreaSum.mockResolvedValueOnce(Area.create(10));

    mockCultureRepository.create.mockImplementationOnce((p: Culture) =>
      Promise.resolve(p),
    );

    const getValidateCultureAreaService = vi.spyOn(
      ValidateCultureAreaService,
      'execute',
    );

    await useCase.execute(slug, producerId, dto);

    expect(mockDatabaseService.transaction).toHaveBeenCalled();

    expect(mockCultureRepository.findPropertyBySlug).toHaveBeenCalledWith(
      slug,
      expect.any(Object),
    );

    expect(mockCultureRepository.getPropertyArea).toHaveBeenCalledWith(
      slug,
      expect.any(Object),
    );

    expect(mockCultureRepository.cultureAreaSum).toHaveBeenCalledWith(
      'prop-1',
      expect.any(Object),
    );

    expect(getValidateCultureAreaService).toHaveBeenCalledOnce();

    expect(mockCultureRepository.create).toHaveBeenCalledOnce();
    expect(mockCultureRepository.create).toHaveBeenCalledWith(
      expect.any(Culture),
      expect.any(Object),
    );

    expect(mockEventEmitter.emit).toHaveBeenCalled();
  });

  it('Should throw an error and not create Culture if ValidateCultureAreaService fails', async () => {
    const slug = 'property-slug';
    const producerId = 'producer-123';
    const dto = { name: 'Soy', allocatedArea: 200 };

    mockCultureRepository.findPropertyBySlug.mockResolvedValueOnce('prop-1');
    mockCultureRepository.getPropertyArea.mockResolvedValueOnce(
      Area.create(100),
    );
    mockCultureRepository.cultureAreaSum.mockResolvedValueOnce(Area.create(10));

    const validateServiceSpy = vi.spyOn(ValidateCultureAreaService, 'execute');

    await expect(useCase.execute(slug, producerId, dto)).rejects.toThrow();

    expect(validateServiceSpy).toHaveBeenCalledOnce();
    expect(mockCultureRepository.create).not.toHaveBeenCalled();
    expect(mockEventEmitter.emit).not.toHaveBeenCalled();
  });
});
