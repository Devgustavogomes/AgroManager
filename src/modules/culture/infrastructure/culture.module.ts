import { Module } from '@nestjs/common';
import { CultureContract } from '../domain/repositories/culture.repository.interface';
import { CultureController } from '../presentation/culture.controller';
import { CultureRepository } from './persistence/culture.repository';
import { CreateCultureUseCase } from '../aplication/use-cases/create-culture.service';
import { IsCultureOwnerUseCase } from '../aplication/use-cases/is-culture-owner.service';
import { FindByIdCultureUseCase } from '../aplication/use-cases/find-by-id.service';
import { UpdateCultureUseCase } from '../aplication/use-cases/update-culture.service';
import { DeleteCultureUseCase } from '../aplication/use-cases/delete-culture.service';

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
