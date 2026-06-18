import { Module } from '@nestjs/common';
import { CultureContract } from '../domain/repositories/culture.repository.interface';
import { CultureController } from '../presentation/culture.controller';
import { CultureRepository } from './persistence/culture.repository';
import { CreateCultureUseCase } from '../application/use-cases/create-culture';
import { IsCultureOwnerUseCase } from '../application/use-cases/is-culture-owner';
import { FindByIdCultureUseCase } from '../application/use-cases/find-by-id';
import { UpdateCultureUseCase } from '../application/use-cases/update-culture';
import { DeleteCultureUseCase } from '../application/use-cases/delete-culture';

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
