/* eslint-disable @typescript-eslint/unbound-method */
import { describe, it, expect, vi, beforeEach, Mocked } from 'vitest';
import { DatabaseService } from 'src/infra/database/service';
import { PropertyContract } from '../../domain/repositories/property-repository.interface';
import { CreatePropertyUseCase } from './create-property';
import { BadRequestException } from '@nestjs/common';

describe('Create Property', () => {
  let useCase: CreatePropertyUseCase;
  let mockPropertyRepository: Mocked<PropertyContract>;
  let mockDatabaseService: Mocked<DatabaseService>;

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
    } as unknown as Mocked<DatabaseService>;

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

    mockPropertyRepository.count.mockResolvedValue(5);

    mockPropertyRepository.create.mockImplementation((p) => Promise.resolve(p));

    await expect(() => useCase.execute('123', dto)).rejects.toThrow(
      BadRequestException,
    );
  });
});
