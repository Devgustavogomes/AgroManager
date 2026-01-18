import { ProducerController } from '../../modules/producer/controller';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { AuthModule } from 'src/infra/auth/module';
import configuration from 'src/config/configuration';
import { envSchema } from 'src/config/dto/env.dto';
import { DatabaseModule } from 'src/infra/database/module';
import { ProducerModule } from 'src/modules/producer/module';
import { PropertyController } from 'src/modules/property/controller';
import { PropertyModule } from 'src/modules/property/module';
import { RedisModule } from 'src/infra/redis/module';
import { AuthenticatedRequest } from 'src/shared/types/authenticatedRequest';
import { ProducerOutput } from 'src/modules/producer/dto';
import { PropertyOutputDto } from 'src/modules/property/dto';
import {
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

let propertyController: PropertyController;
let producerController: ProducerController;
let producer1: ProducerOutput;

beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
        load: [configuration],
        validate: (env) => envSchema.parse(env),
      }),
      AuthModule,
      DatabaseModule,
      RedisModule,
      ProducerModule,
      PropertyModule,
    ],
  }).compile();

  propertyController = moduleRef.get<PropertyController>(PropertyController);

  producerController = moduleRef.get<ProducerController>(ProducerController);

  producer1 = await producerController.create({
    username: 'string',
    email: 'testtt3@gmail.com',
    password: "^%B'aQqRxsgq>-U1^",
  });
});

describe('Property Good Path', () => {
  let property: PropertyOutputDto;
  test('Create Property Successfull', async () => {
    const input = {
      name: 'string',
      city: 'string',
      state: 'strin',
      arableArea: 5000,
      vegetationArea: 3000,
    };

    const auth = {
      producer: {
        id: producer1.idProducer,
      },
    } as AuthenticatedRequest;

    property = await propertyController.create(auth, input);

    expect(property).toStrictEqual({
      name: input.name,
      city: input.city,
      state: input.state,
      arableArea: input.arableArea,
      vegetationArea: input.vegetationArea,
      totalArea: (input.arableArea * 100 + input.vegetationArea * 100) / 100,
      idProperty: expect.any(String),
      idProducer: producer1.idProducer,
      createdAt: expect.any(String),
      updatedAt: null,
    });
  });

  test('Find by id property successfull', async () => {
    const params = {
      id: property.idProperty,
    };
    const result = await propertyController.findById(params);

    expect(result).toStrictEqual({
      name: expect.any(String),
      city: expect.any(String),
      state: expect.any(String),
      arableArea: expect.any(Number),
      vegetationArea: expect.any(Number),
      totalArea: expect.any(Number),
      idProperty: property.idProperty,
      idProducer: producer1.idProducer,
      createdAt: expect.any(String),
      updatedAt: null,
    });
  });

  test('Update property successfull', async () => {
    const params = {
      id: property.idProperty,
    };

    const input = {
      name: 'stringc',
      city: 'stringc',
      state: 'strinc',
      arableArea: 2000,
      vegetationArea: 3000,
    };
    const result = await propertyController.update(params, input);

    expect(result).toStrictEqual({
      name: expect.any(String),
      city: expect.any(String),
      state: expect.any(String),
      arableArea: expect.any(Number),
      vegetationArea: expect.any(Number),
      totalArea: expect.any(Number),
      idProperty: property.idProperty,
      idProducer: producer1.idProducer,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  test('Delete property successfull', async () => {
    const params = {
      id: property.idProperty,
    };

    await propertyController.delete(params);

    await expect(propertyController.findById(params)).rejects.toThrow(
      NotFoundException,
    );
  });
});

describe('Property bad path', () => {
  let property: PropertyOutputDto;
  test('Create property successfull', async () => {
    const input = {
      name: 'string',
      city: 'string',
      state: 'strin',
      arableArea: 5000,
      vegetationArea: 3000,
    };

    const auth = {
      producer: {
        id: producer1.idProducer,
      },
    } as AuthenticatedRequest;

    property = await propertyController.create(auth, input);
  });
  test('Update property without all areas', async () => {
    const params = {
      id: property.idProperty,
    };

    const input = {
      name: 'stringc',
      city: 'stringc',
      state: 'strinc',
      arableArea: 2000,
    };
    await expect(propertyController.update(params, input)).rejects.toThrow(
      UnprocessableEntityException,
    );
  });
  test('Delete property successfull', async () => {
    const params = {
      id: property.idProperty,
    };

    await propertyController.delete(params);
  });
});

afterAll(async () => {
  await producerController.remove(producer1.idProducer);
});
