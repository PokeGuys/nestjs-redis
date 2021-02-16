import { Injectable, Module } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as Redis from 'ioredis';
import * as RedisMock from 'ioredis-mock';
import { InjectRedis } from './common/redis.decorator';
import { getClientToken } from './common/redis.util';
import {
  RedisClient,
  RedisModuleOptions,
  RedisOptionsFactory,
} from './interfaces/redis-module-options.interface';
import { RedisModule } from './redis.module';

jest.mock('ioredis', () => {
  const Redis = require('ioredis-mock');

  if (typeof Redis === 'object') {
    // the first mock is an ioredis shim because ioredis-mock depends on it
    // https://github.com/stipsan/ioredis-mock/blob/master/src/index.js#L101-L111
    return {
      Command: { _transformer: { argument: {}, reply: {} } },
    };
  }

  let instance: any = null;

  // second mock for our code
  return function (...args) {
    if (instance) {
      return instance.createConnectedClient();
    }

    instance = new Redis(args);

    return instance;
  };
});

describe('RedisModule', () => {
  beforeAll(() => new Redis());
  describe('forRoot', () => {
    let moduleRef: TestingModule;

    it('should inject the redis with the default name', async () => {
      moduleRef = await Test.createTestingModule({
        imports: [RedisModule.forRoot({ uri: 'redis://localhost:6379/' })],
      }).compile();

      const redisModule = moduleRef.get(RedisModule);
      expect(redisModule).toBeInstanceOf(RedisModule);
    });

    it('should inject the redis with the given name', async () => {
      moduleRef = await Test.createTestingModule({
        imports: [
          RedisModule.forRoot({
            clientName: 'named',
            host: 'localhost',
            port: 6379,
            keepAlive: 1000,
          }),
        ],
      }).compile();

      const client = moduleRef.get<RedisClient>(getClientToken('named'));
      expect(client).toBeInstanceOf(RedisMock);
    });

    afterEach(async () => {
      await moduleRef.close();
    });
  });

  describe('forRootAsync', () => {
    let moduleRef: TestingModule;
    describe('single configuration', () => {
      describe('useFactory', () => {
        beforeAll(async () => {
          moduleRef = await Test.createTestingModule({
            imports: [
              RedisModule.forRootAsync({
                name: 'named',
                useFactory: () => ({
                  uri: 'redis://localhost:6379/',
                }),
              }),
            ],
          }).compile();
        });
        afterAll(async () => {
          await moduleRef.close();
        });
        it('should inject the redis with the given name', async () => {
          const client = moduleRef.get<RedisClient>(getClientToken('named'));
          expect(client).toBeInstanceOf(RedisMock);
        });
      });

      describe('useClass', () => {
        class RedisModuleConfigService implements RedisOptionsFactory {
          createRedisOptions(): RedisModuleOptions {
            return {
              uri: 'redis://localhost:6379/',
            };
          }
        }

        beforeAll(async () => {
          moduleRef = await Test.createTestingModule({
            imports: [
              RedisModule.forRootAsync({
                name: 'useClass',
                useClass: RedisModuleConfigService,
                inject: [RedisModuleConfigService],
              }),
            ],
          }).compile();
        });
        afterAll(async () => {
          await moduleRef.close();
        });

        it('should inject the redis with the given name', async () => {
          const client = moduleRef.get<RedisClient>(getClientToken('useClass'));
          expect(client).toBeInstanceOf(RedisMock);
        });
      });

      describe('useExisting', () => {
        @Injectable()
        class RedisModuleConfigService implements RedisOptionsFactory {
          createRedisOptions(): RedisModuleOptions {
            return {
              uri: 'redis://localhost:6379/',
            };
          }
        }

        @Module({
          providers: [RedisModuleConfigService],
          exports: [RedisModuleConfigService],
        })
        class ConfigModule {}

        beforeAll(async () => {
          moduleRef = await Test.createTestingModule({
            imports: [
              RedisModule.forRootAsync({
                name: 'useExisting',
                useExisting: RedisModuleConfigService,
                imports: [ConfigModule],
              }),
            ],
          }).compile();
        });
        afterAll(async () => {
          await moduleRef.close();
        });

        it('should inject the redis with the given name', async () => {
          const client = moduleRef.get<RedisClient>(getClientToken('useExisting'));
          expect(client).toBeInstanceOf(RedisMock);
        });
      });
    });

    describe('multiple configuration', () => {
      describe('useFactory', () => {
        beforeAll(async () => {
          moduleRef = await Test.createTestingModule({
            imports: [
              RedisModule.forRootAsync({
                name: 'test1',
                useFactory: () => ({
                  uri: 'redis://localhost:6379/',
                }),
              }),
              RedisModule.forRootAsync({
                name: 'test2',
                useFactory: () => ({
                  uri: 'redis://localhost:6379/',
                }),
              }),
            ],
          }).compile();
        });
        afterAll(async () => {
          await moduleRef.close();
        });

        it('should inject the redis with the name "test1"', async () => {
          const client = moduleRef.get<RedisClient>(getClientToken('test1'));
          expect(client).toBeInstanceOf(RedisMock);
        });

        it('should inject the redis with the name "test2"', async () => {
          const client = moduleRef.get<RedisClient>(getClientToken('test2'));
          expect(client).toBeInstanceOf(RedisMock);
        });
      });
    });
  });

  describe('InjectRedis', () => {
    it('should inject a redis instance with default connection', async () => {
      @Injectable()
      class TestProvider {
        constructor(@InjectRedis() private readonly redis: RedisClient) {}

        getClient() {
          return this.redis;
        }
      }

      const module = await Test.createTestingModule({
        imports: [RedisModule.forRoot({ uri: 'redis://localhost:6379/' })],
        providers: [TestProvider],
      }).compile();
      const app = module.createNestApplication();
      await app.init();

      const provider = module.get(TestProvider);
      expect(provider.getClient()).toBeInstanceOf(RedisMock);

      await app.close();
    });
  });
});
