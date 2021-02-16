# NestJS Redis

[![CI](https://github.com/PokeGuys/nestjs-redis/workflows/CI/badge.svg)](https://github.com/PokeGuys/nestjs-redis/actions?query=workflow%3ACI) [![npm version](https://badge.fury.io/js/%40pokeguys%2Fnestjs-redis.svg)](https://badge.fury.io/js/%40pokeguys%2Fnestjs-redis) [![dependencies](https://david-dm.org/pokeguys/nestjs-redis.svg)](https://david-dm.org/pokeguys/nestjs-redis) [![license](https://img.shields.io/github/license/pokeguys/nestjs-redis.svg)](https://github.com/PokeGuys/nestjs-redis/blob/master/LICENSE) [![codecov](https://codecov.io/gh/PokeGuys/nestjs-redis/branch/master/graph/badge.svg?token=Y6V0BEYVZH)](https://codecov.io/gh/PokeGuys/nestjs-redis)

[ioredis](https://github.com/luin/ioredis) module for [Nest](https://github.com/nestjs/nest) that supported cluster, sentinel mode.

## Quick Start

### Installation

```bash
$ npm i --save @pokeguys/nestjs-redis ioredis
# or
$ yarn add @pokeguys/nestjs-redis ioredis
```

### Usage

```ts
// app.module.ts
@Module({
  imports: [
    RedisModule.forRoot({ uri: 'redis://localhost:6379/' }),
  ],
})
export class AppModule {}

// app.service.ts
@Injectable()
export class AppService {
  constructor(@InjectRedis() private readonly redis: RedisClient) {}
}
```

## Documentation

you can find all the documentation [here](docs/setup.md) for the redis module.

## License

[MIT License](LICENSE)
