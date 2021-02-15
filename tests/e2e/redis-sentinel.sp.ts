import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Server } from 'http';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { SentinelModule } from '../src/sentinel/sentinel.module';

describe('IORedis - Sentinel', () => {
  let server: Server;
  let app: INestApplication;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule, SentinelModule],
    }).compile();
    app = module.createNestApplication();
    server = app.getHttpServer();
    await app.init();
  });

  it('should return created data from default connection', (done) => {
    const createDto = { age: 4, name: 'Testing Sentinel', countryCode: 'Sentinel' };
    request(server)
      .post('/sentinel')
      .send(createDto)
      .expect(201)
      .end((err, { body }) => {
        expect(err).toBeNull();
        expect(body.age).toEqual(createDto.age);
        expect(body.name).toEqual(createDto.name);
        expect(body.countryCode).toEqual(createDto.countryCode);
        done();
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
