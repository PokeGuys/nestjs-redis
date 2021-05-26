import { Injectable, Module } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as Redis from 'ioredis';
import { InjectRedis } from './common/redis.decorator';
import { getClientToken } from './common/redis.util';
import {
  RedisClient,
  RedisModuleOptions,
  RedisOptionsFactory,
} from './interfaces/redis-module-options.interface';
import { RedisModule } from './redis.module';

jest.mock('ioredis', () => require('ioredis-mock/jest'));

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
            connectionName: 'named',
            host: 'localhost',
            port: 6379,
            keepAlive: 1000,
          }),
        ],
      }).compile();

      const client = moduleRef.get<RedisClient>(getClientToken('named'));
      expect(client).toBeInstanceOf(Redis);
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
                useFactory: (connectionName?: string) => ({
                  connectionName,
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
          expect(client).toBeInstanceOf(Redis);
        });
      });

      describe('useClass', () => {
        class RedisModuleConfigService implements RedisOptionsFactory {
          createRedisOptions(connectionName?: string): RedisModuleOptions {
            return {
              connectionName,
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
          expect(client).toBeInstanceOf(Redis);
        });
      });

      describe('useExisting', () => {
        @Injectable()
        class RedisModuleConfigService implements RedisOptionsFactory {
          createRedisOptions(connectionName?: string): RedisModuleOptions {
            return {
              connectionName,
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
          expect(client).toBeInstanceOf(Redis);
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
                useFactory: (connectionName?: string) => ({
                  connectionName,
                  uri: 'redis://localhost:6379/',
                }),
              }),
              RedisModule.forRootAsync({
                name: 'test2',
                useFactory: (connectionName?: string) => ({
                  connectionName,
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
          expect(client).toBeInstanceOf(Redis);
        });

        it('should inject the redis with the name "test2"', async () => {
          const client = moduleRef.get<RedisClient>(getClientToken('test2'));
          expect(client).toBeInstanceOf(Redis);
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
      expect(provider.getClient()).toBeInstanceOf(Redis);

      await app.close();
    });
  });

  describe('Cluster mode', () => {
    let moduleRef: TestingModule;
    it('should inject the redis with the given name', async () => {
      moduleRef = await Test.createTestingModule({
        imports: [
          RedisModule.forRoot({
            connectionName: 'named',
            cluster: {
              nodes: [
                {
                  host: 'localhost',
                  port: 7000,
                },
              ],
              redisOptions: {
                enableReadyCheck: true,
              },
            },
          }),
        ],
      }).compile();

      const client = moduleRef.get<RedisClient>(getClientToken('named'));
      expect(client).toBeInstanceOf(Redis.Cluster);
    });

    afterEach(async () => {
      await moduleRef.close();
    });
  });
});
