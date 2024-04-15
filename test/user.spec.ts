import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TestService } from './test.service';
import { TestModule } from './test.module';

describe('UserController (integration)', () => {
  let app: INestApplication;
  let testService: TestService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    testService = app.get(TestService);
  });

  describe('POST /users/register', () => {
    beforeEach(async () => {
      await testService.deleteAll();
    });

    afterEach(async () => {
      await testService.deleteAll();
    });

    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/users/register')
        .send({
          username: '',
          password: '',
          name: '',
        });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to register', async () => {
      const response = await request(app.getHttpServer())
        .post('/users/register')
        .send({
          username: 'test',
          password: 'test',
          name: 'John Doe',
        });

      expect(response.status).toBe(200);
      expect(response.body.data.username).toBe('test');
      expect(response.body.data.name).toBe('John Doe');
    });

    it('should be rejected if "username" already exists', async () => {
      await testService.createUser();
      const response = await request(app.getHttpServer())
        .post('/users/register')
        .send({
          username: 'test',
          password: 'test',
          name: 'John Doe',
        });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('POST /users/login', () => {
    beforeEach(async () => {
      await testService.deleteAll();
      await testService.createUser();
    });

    afterEach(async () => {
      await testService.deleteAll();
    });

    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/users/login')
        .send({
          username: '',
          password: '',
        });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to login', async () => {
      const response = await request(app.getHttpServer())
        .post('/users/login')
        .send({
          username: 'test',
          password: 'test',
        });

      expect(response.status).toBe(200);
      expect(response.body.data.username).toBe('test');
      expect(response.body.data.name).toBe('John Doe');
      expect(response.body.data.token).toBeDefined();
    });
  });

  describe('GET /users/current', () => {
    beforeEach(async () => {
      await testService.deleteAll();
      await testService.createUser();
    });

    afterEach(async () => {
      await testService.deleteAll();
    });

    it('should be rejected if token is invalid', async () => {
      const response = await request(app.getHttpServer())
        .get('/users/current')
        .set('Authorization', 'wrong');

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to get user', async () => {
      const response = await request(app.getHttpServer())
        .get('/users/current')
        .set('Authorization', 'test');

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual({
        username: 'test',
        name: 'John Doe',
      });
    });
  });
});
