import { Injectable, NotFoundException } from '@nestjs/common';
import { CultureContract } from '../../domain/repositories/culture.repository.interface';
import { CultureOutput } from '../dto/cultureOutput.dto';
import { CultureMapper } from '../../infrastructure/culture.mapper';

@Injectable()
export class FindByIdCultureUseCase {
  constructor(private readonly cultureRepository: CultureContract) {}

  async execute(id: string): Promise<CultureOutput> {
    const result = await this.cultureRepository.findById(id);

    if (!result) {
      throw new NotFoundException('Culture not found');
    }

    return CultureMapper.toResponse([result])[0];
  }
}
