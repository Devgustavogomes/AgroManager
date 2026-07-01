import { Injectable } from '@nestjs/common';
import { CultureContract } from '../../domain/repositories/cultureRepository.interface';
import { CultureOutput } from '../dto/cultureOutput.dto';
import { CultureMapper } from '../../infrastructure/culture.mapper';
import { NotFoundError } from 'src/shared/domain/errors/notFoundError';

@Injectable()
export class FindByIdCultureUseCase {
  constructor(private readonly cultureRepository: CultureContract) {}

  async execute(id: string): Promise<CultureOutput> {
    const result = await this.cultureRepository.findById(id);

    if (!result) {
      throw new NotFoundError('Culture not found');
    }

    return CultureMapper.toResponse([result])[0];
  }
}
