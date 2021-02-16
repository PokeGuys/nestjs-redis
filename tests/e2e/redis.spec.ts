import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Server } from 'http';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('IORedis', () => {
  let server: Server;
  let app: INestApplication;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    server = app.getHttpServer();
    await app.init();
  });

  it('should return created data', (done) => {
    const createDto = { id: '1', title: 'Testing', message: 'HelloWorld' };
    request(server)
      .post('/samples/default')
      .send(createDto)
      .expect(201)
      .end((err, { body }) => {
        expect(err).toBeNull();
        expect(body.id).toEqual(createDto.id);
        expect(body.title).toEqual(createDto.title);
        expect(body.message).toEqual(createDto.message);
        done();
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
