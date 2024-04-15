import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppController (integration)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('GET /', () => {
    it('should be able to return health json', async () => {
      const response = await request(app.getHttpServer()).get('/');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        statusCode: 200,
        message: 'Server is running',
      });
    });
  });
});
