import { RedisModule } from 'src/infra/redis/module';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { AuthModule } from 'src/infra/auth/module';
import configuration from 'src/config/configuration';
import { envSchema } from 'src/config/dto/env.dto';
import { DatabaseModule } from 'src/infra/database/module';
import { ProducerModule } from 'src/modules/producer/module';
import { RedisService } from 'src/infra/redis/service';
import { ProducerController } from 'src/modules/producer/controller';
import { producerOutput } from 'src/modules/producer/dto/producerOutput.dto';

let producerController: ProducerController;
let redisService: RedisService;
let producer: producerOutput;

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
    ],
  }).compile();

  producerController = moduleRef.get<ProducerController>(ProducerController);

  redisService = moduleRef.get<RedisService>(RedisService);
});

test('Should be defined', () => {
  expect(producerController).toBeDefined();
});

describe('Producer Good Path', () => {
  test('Create a new producer', async () => {
    const input = {
      username: 'GustavoTeste',
      cpf_or_cnpj: '06438212383',
      password: 'DevTest311*',
    };
    producer = await producerController.create(input);

    expect(producer).toStrictEqual({
      id_producer: expect.any(String),
      username: expect.any(String),
      cpf_or_cnpj: expect.any(String),
      role: 'USER',
      created_at: expect.any(Date),
      updated_at: null,
    });
  });
  test('Find all producer', async () => {
    const result = await producerController.findAll();

    expect(result).toContainEqual({
      id_producer: expect.any(String),
      username: expect.any(String),
      cpf_or_cnpj: expect.any(String),
      role: 'USER',
      created_at: expect.any(Date),
      updated_at: null,
    });
  });
  test('Find one producer', async () => {
    const result = await producerController.findOne(producer.id_producer);

    expect(result).toStrictEqual({
      id_producer: expect.any(String),
      username: expect.any(String),
      cpf_or_cnpj: expect.any(String),
      role: 'USER',
      created_at: expect.any(Date),
      updated_at: null,
    });
  });
  test('Update producer', async () => {
    const input = {
      username: 'GusTestC',
      cpf_or_cnpj: '09329472512',
    };
    const result = await producerController.update(producer.id_producer, input);

    expect(result.username).toBe(input.username);
    expect(result.cpf_or_cnpj).toBe(input.cpf_or_cnpj);
  });
  test('Delete producer', async () => {
    await producerController.remove(producer.id_producer);

    const result = await producerController.findOne(producer.id_producer);

    expect(result).toBeUndefined();
  });
});

afterAll(async () => {
  if (redisService) await redisService.onModuleDestroy();
});
