# How to use?

Check this documentation for how to use module `@pokeguys/nestjs-redis`.

## Installation

```bash
$ npm i --save @pokeguys/nestjs-redis ioredis
# or
$ yarn add @pokeguys/nestjs-redis ioredis
```

## Module

### Configuration Options

The table only provide module customized options.

For more configuration options, please reference the API documentation of [ioredis.Redis](https://github.com/luin/ioredis/blob/master/API.md#new_Redis_new).

#### RedisModuleOptions

| Option name | Type | Default | Description |
|---|---|---|---|
| uri | `string` |  | URL of the redis connection. If set the `port`, `host`, `family`, and `path` will be ignored. |
| name | `string` |  | The name of redis master. This options only available for sentinel mode. |
| connectionName | `string` | `DefaultClient` | The name of the client. Used for redis client dependency injection. |
| cluster | `RedisClusterModuleOptions` |  | The configuration for cluster mode. |

#### RedisClusterModuleOptions

For more cluster configuration options, please reference the API documentation of [ioredis.Cluster](https://github.com/luin/ioredis/blob/master/API.md#new_Cluster_new).

| Option name | Type | Default | Description |
|---|---|---|---|
| nodes | `NodeConfiguration[]` | | An array of nodes in the cluster |

### Initialization

```ts
// app.module.ts
import { Module } from '@nestjs/common';
import { RedisModule } from 'nestjs-ioredis';

@Module({
  imports: [
    RedisModule.forRoot({
      uri: 'redis://localhost:6379/'
    }),
  ],
})
export class AppModule {}
```

### Asynchronous Initialization

```ts
// app.module.ts
import { Module } from '@nestjs/common';
import { RedisModule } from '@pokeguys/nestjs-redis';

@Module({
  imports: [
    RedisModule.forRootAsync({
      name: 'conn',
      useFactory: (connectionName?: string) => ({
        connectionName,
        uri: 'redis://localhost:6379/'
      }),
    }),
  ],
})
export class AppModule {}
```

#### Cluster mode

```ts
// app.module.ts
import { Module } from '@nestjs/common';
import { RedisModule } from '@pokeguys/nestjs-redis';

@Module({
  imports: [
    RedisModule.forRoot({
      cluster: {
        nodes: [
          {
            host: 'localhost',
            port: 6379,
          }
        ],
        redisOptions: {
          password: 'Passw0rd!',
        },
      },
    }),
  ],
})
export class AppModule {}
```

## Service

```ts
// app.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRedis, RedisClient } from '@pokeguys/nestjs-redis';

@Injectable()
export class AppService {
  constructor(@InjectRedis() private readonly redis: RedisClient) {}
}
```

`InjectRedis()` injected `ioredis` client directly to which you can execute redis commands.

```ts
// app.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRedis, RedisClient } from '@pokeguys/nestjs-redis';

@Injectable()
export class AppService {
  constructor(@InjectRedis() private readonly redis: RedisClient) {}

  public async example(): Promise<string> {
    return this.redis.get('redis-key');
  }
}
```

## Example

A working example is available [here](/tests/src).
