/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';

let app: INestApplication;
let token: string;
let idProducer: string;

beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleRef.createNestApplication();
  await app.init();
});

describe('Producer Good Path', () => {
  test('Create producer', async () => {
    const payload = {
      username: 'string',
      cpf_or_cnpj: '52610775397389',
      password: '<ApA$Xwmm<CvL8JVH',
    };

    const response = await request(app.getHttpServer())
      .post('/producers')
      .send(payload)
      .expect(HttpStatus.CREATED);

    idProducer = response.body.id_producer as string;
  });

  test('Login producer to get token', async () => {
    const loginPayload = {
      CPForCNPJ: '52610775397389',
      password: '<ApA$Xwmm<CvL8JVH',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginPayload)
      .expect(HttpStatus.CREATED);

    token = response.body.accessToken as string;
  });

  test('Update producer', async () => {
    const payload = {
      username: 'striing',
      cpf_or_cnpj: '52610775317348',
    };

    await request(app.getHttpServer())
      .patch(`/producers/${idProducer}`)
      .set('Authorization', `Bearer ${token}`)
      .send(payload)
      .expect(HttpStatus.OK);
  });

  test('Delete producer', async () => {
    await request(app.getHttpServer())
      .delete(`/producers/${idProducer}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.NO_CONTENT);
  });
});

describe('Producer Intruder Bad Path', () => {
  let idProducer1: string;
  let idProducer2: string;
  let tokenProducer1: string;
  let tokenProducer2: string;
  beforeAll(async () => {
    const payload1 = {
      username: 'string',
      cpf_or_cnpj: '52610775397390',
      password: '<ApA$Xwmm<CvL8JVH',
    };

    const response1 = await request(app.getHttpServer())
      .post('/producers')
      .send(payload1)
      .expect(HttpStatus.CREATED);

    idProducer1 = response1.body.id_producer as string;

    const payload2 = {
      username: 'string',
      cpf_or_cnpj: '52610775397334',
      password: '<ApA$Xwmm<CvL8JVH',
    };

    const response2 = await request(app.getHttpServer())
      .post('/producers')
      .send(payload2)
      .expect(HttpStatus.CREATED);

    idProducer2 = response2.body.id_producer as string;

    const loginPayload1 = {
      CPForCNPJ: '52610775397390',
      password: '<ApA$Xwmm<CvL8JVH',
    };

    const responseLogin1 = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginPayload1)
      .expect(HttpStatus.CREATED);

    tokenProducer1 = responseLogin1.body.accessToken as string;

    const loginPayload2 = {
      CPForCNPJ: '52610775397334',
      password: '<ApA$Xwmm<CvL8JVH',
    };

    const responseLogin2 = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginPayload2)
      .expect(HttpStatus.CREATED);

    tokenProducer2 = responseLogin2.body.accessToken as string;
  });

  test('Intruder try to update a producer', async () => {
    const payload = {
      username: 'striing',
      cpf_or_cnpj: '52610775317395',
    };

    await request(app.getHttpServer())
      .patch(`/producers/${idProducer1}`)
      .set('Authorization', `Bearer ${tokenProducer2}`)
      .send(payload)
      .expect(HttpStatus.FORBIDDEN);
  });

  test('Intruder try to delete a producer', async () => {
    await request(app.getHttpServer())
      .delete(`/producers/${idProducer1}`)
      .set('Authorization', `Bearer ${tokenProducer2}`)
      .expect(HttpStatus.FORBIDDEN);
  });

  afterAll(async () => {
    await request(app.getHttpServer())
      .delete(`/producers/${idProducer1}`)
      .set('Authorization', `Bearer ${tokenProducer1}`)
      .expect(HttpStatus.NO_CONTENT);

    await request(app.getHttpServer())
      .delete(`/producers/${idProducer2}`)
      .set('Authorization', `Bearer ${tokenProducer2}`)
      .expect(HttpStatus.NO_CONTENT);
  });
});

afterAll(async () => {
  await app.close();
});

// falta eu fazer o test dos get do producer
