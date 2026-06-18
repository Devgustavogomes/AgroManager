import { Module } from '@nestjs/common';
import { CultureContract } from '../domain/repositories/cultureRepository.interface';
import { CultureController } from '../presentation/culture.controller';
import { CultureRepository } from './persistence/culture.repository';
import { CreateCultureUseCase } from '../application/use-cases/createCulture';
import { IsCultureOwnerUseCase } from '../application/use-cases/isCultureOwner';
import { FindByIdCultureUseCase } from '../application/use-cases/findById';
import { UpdateCultureUseCase } from '../application/use-cases/updateCulture';
import { DeleteCultureUseCase } from '../application/use-cases/deleteCulture';

@Module({
  controllers: [CultureController],
  providers: [
    CreateCultureUseCase,
    IsCultureOwnerUseCase,
    FindByIdCultureUseCase,
    UpdateCultureUseCase,
    DeleteCultureUseCase,
    { provide: CultureContract, useClass: CultureRepository },
  ],
})
export class CultureModule {}
