import { describe, it, expect, vi, beforeEach, Mocked } from 'vitest';
import { DatabaseContract } from '@agromanager/infra/database/contract';
import { PropertyContract } from '../../domain/repositories/propertyRepository.contract';
import { CreatePropertyUseCase } from './createProperty';
import { BadRequestException } from '@nestjs/common';
import { MAX_PROPERTIES_PER_PRODUCER } from '../../domain/constants/maxProperties.constant';

describe('Create Property', () => {
  let useCase: CreatePropertyUseCase;
  let mockPropertyRepository: Mocked<PropertyContract>;
  let mockDatabaseService: Mocked<DatabaseContract>;

  beforeEach(() => {
    mockPropertyRepository = {
      findBySlug: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
      isOwner: vi.fn(),
    };

    mockDatabaseService = {
      transaction: vi.fn().mockImplementation((callback: any) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return callback({});
      }),
    } as unknown as Mocked<DatabaseContract>;

    useCase = new CreatePropertyUseCase(
      mockPropertyRepository,
      mockDatabaseService,
    );
  });

  it('Should create a property successfully', async () => {
    const dto = {
      name: 'Property One',
      totalArea: 100,
      arableArea: 50,
      vegetationArea: 50,
      city: 'City',
      state: 'State',
    };

    mockPropertyRepository.count.mockResolvedValue(0);

    mockPropertyRepository.create.mockImplementation((p) => Promise.resolve(p));

    await useCase.execute('123', dto);

    expect(mockDatabaseService.transaction).toHaveBeenCalledOnce();
    expect(mockPropertyRepository.count).toHaveBeenCalledOnce();
    expect(mockPropertyRepository.create).toHaveBeenCalledOnce();
  });
  it('Should not create a property if producer has a 5 properties', async () => {
    const dto = {
      name: 'Property One',
      totalArea: 100,
      arableArea: 50,
      vegetationArea: 50,
      city: 'City',
      state: 'State',
    };

    mockPropertyRepository.count.mockResolvedValue(MAX_PROPERTIES_PER_PRODUCER);

    mockPropertyRepository.create.mockImplementation((p) => Promise.resolve(p));

    await expect(() => useCase.execute('123', dto)).rejects.toThrow(
      BadRequestException,
    );
  });
});
