/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { MAX_PROPERTIES } from 'src/config/constants';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { CreatePropertyDto, PropertyOutputDto } from 'src/modules/property/dto';

let app: INestApplication;
let idProducer1: string;
let idProducer2: string;
let tokenProducer1: string;
let tokenProducer2: string;

beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleRef.createNestApplication();
  await app.init();

  const payload1 = {
    username: 'string',
    email: 'property9@gmail.com',
    password: '<ApA$Xwmm<CvL8JVH',
  };

  const response1 = await request(app.getHttpServer())
    .post('/producers')
    .send(payload1)
    .expect(HttpStatus.CREATED);

  idProducer1 = response1.body.idProducer as string;

  const payload2 = {
    username: 'string',
    email: 'property0@gmail.com',
    password: '<ApA$Xwmm<CvL8JVH',
  };

  const response2 = await request(app.getHttpServer())
    .post('/producers')
    .send(payload2);

  idProducer2 = response2.body.idProducer as string;

  const loginPayload1 = {
    email: 'property9@gmail.com',
    password: '<ApA$Xwmm<CvL8JVH',
  };

  const responseLogin1 = await request(app.getHttpServer())
    .post('/auth/login')
    .send(loginPayload1);

  tokenProducer1 = responseLogin1.body.accessToken as string;

  const loginPayload2 = {
    email: 'property0@gmail.com',
    password: '<ApA$Xwmm<CvL8JVH',
  };

  const responseLogin2 = await request(app.getHttpServer())
    .post('/auth/login')
    .send(loginPayload2);

  tokenProducer2 = responseLogin2.body.accessToken as string;
});

describe('E2E | Property good path', () => {
  let property: PropertyOutputDto;
  test('E2E | create property successfull', async () => {
    const payload: CreatePropertyDto = {
      name: 'property1',
      city: 'Canindé',
      state: 'CE',
      arableArea: 500,
      vegetationArea: 1000,
    };

    const result = await request(app.getHttpServer())
      .post('/property')
      .send(payload)
      .set('Authorization', `Bearer ${tokenProducer1}`)
      .expect(HttpStatus.CREATED);

    property = result.body;
  });

  test('E2E | get property successfull', async () => {
    await request(app.getHttpServer())
      .get(`/property/${property.idProperty}`)
      .set('Authorization', `Bearer ${tokenProducer1}`)
      .expect(HttpStatus.OK);
  });

  test('E2E | update property successfull', async () => {
    const payload: CreatePropertyDto = {
      name: 'property1',
      city: 'Fortaleza',
      state: 'CE',
      arableArea: 5000,
      vegetationArea: 1000,
    };
    await request(app.getHttpServer())
      .patch(`/property/${property.idProperty}`)
      .set('Authorization', `Bearer ${tokenProducer1}`)
      .send(payload)
      .expect(HttpStatus.OK);
  });

  test('E2E | delete property successfull', async () => {
    await request(app.getHttpServer())
      .delete(`/property/${property.idProperty}`)
      .set('Authorization', `Bearer ${tokenProducer1}`)
      .expect(HttpStatus.NO_CONTENT);
  });
});

describe('E2E | Property bad path', () => {
  test('E2E | should not allow creating more than 4 properties', async () => {
    const payload: CreatePropertyDto = {
      name: 'property1',
      city: 'Canindé',
      state: 'CE',
      arableArea: 500,
      vegetationArea: 1000,
    };
    for (let i = 0; i <= MAX_PROPERTIES; i++) {
      await request(app.getHttpServer())
        .post('/property')
        .send(payload)
        .set('Authorization', `Bearer ${tokenProducer1}`);
    }

    await request(app.getHttpServer())
      .post('/property')
      .send(payload)
      .set('Authorization', `Bearer ${tokenProducer1}`)
      .expect(HttpStatus.BAD_REQUEST);
  });
});

afterAll(async () => {
  await request(app.getHttpServer())
    .delete(`/producers/${idProducer1}`)
    .set('Authorization', `Bearer ${tokenProducer1}`);

  await request(app.getHttpServer())
    .delete(`/producers/${idProducer2}`)
    .set('Authorization', `Bearer ${tokenProducer2}`);

  await app.close();
});
