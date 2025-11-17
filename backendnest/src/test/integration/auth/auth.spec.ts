/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { ProducerService } from 'src/producer/producer.service';
import { producerOutput } from 'src/producer/dto/producerOutput.dto';
import { AppModule } from 'src/app.module';
import { INestApplication, HttpStatus } from '@nestjs/common';
import request from 'supertest';

let app: INestApplication;
let producerService: ProducerService;
let user: producerOutput;
let accessToken: string;
let refreshToken: string;

beforeAll(async () => {
  const moduleRef: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleRef.createNestApplication();
  await app.init();

  producerService = moduleRef.get<ProducerService>(ProducerService);

  user = await producerService.create({
    name: 'Gustavo',
    CPForCNPJ: '06443884323',
    password: 'Gustavos39%',
  });
});

afterAll(async () => {
  await producerService.delete(user.id);
  await app.close();
});

describe('Good path', () => {
  test('Login successfull', async () => {
    const data = {
      CPForCNPJ: '06443884323',
      password: 'Gustavos39%',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(data);

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toHaveProperty('accessToken');

    expect(response.headers['set-cookie']).toBeDefined();
    expect(response.headers['set-cookie'][0]).toContain('refresh_token=');

    accessToken = response.body.accessToken;
    const cookie = response.headers['set-cookie'][0];
    refreshToken = cookie.match(/refresh_token=([^;]+)/)[1];
  });

  test('Refresh sucessfull', async () => {
    const response = await request(app.getHttpServer())
      .get('/auth/refresh')
      .set('Cookie', `refresh_token=${refreshToken}`);

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toHaveProperty('accessToken');
    expect(response.headers['set-cookie'][0]).toContain('refresh_token=');

    accessToken = response.body.accessToken;
  });

  test('Logout successfull', async () => {
    const response = await request(app.getHttpServer())
      .get('/auth/logout')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toEqual({ message: 'Logout realizado com sucesso' });

    expect(response.headers['set-cookie'][0]).toContain('refresh_token=;');
    expect(response.headers['set-cookie'][0]).toContain('Max-Age=0');
  });
});
