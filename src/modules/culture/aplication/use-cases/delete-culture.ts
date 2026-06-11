import { Injectable } from '@nestjs/common';
import { CultureContract } from '../../domain/repositories/culture.repository.interface';

@Injectable()
export class DeleteCultureUseCase {
  constructor(private readonly cultureRepository: CultureContract) {}

  async execute(id: string): Promise<void> {
    await this.cultureRepository.delete(id);
  }
}
