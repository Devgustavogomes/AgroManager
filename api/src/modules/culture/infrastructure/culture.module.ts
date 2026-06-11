import { Module } from '@nestjs/common';
import { CultureContract } from '../domain/repositories/culture.repository.interface';
import { CultureController } from '../presentation/culture.controller';
import { CultureRepository } from './persistence/culture.repository';
import { CreateCultureUseCase } from '../aplication/use-cases/create-culture';
import { IsCultureOwnerUseCase } from '../aplication/use-cases/is-culture-owner';
import { FindByIdCultureUseCase } from '../aplication/use-cases/find-by-id';
import { UpdateCultureUseCase } from '../aplication/use-cases/update-culture';
import { DeleteCultureUseCase } from '../aplication/use-cases/delete-culture';

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
