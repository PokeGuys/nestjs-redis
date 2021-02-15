import { Injectable } from '@nestjs/common';
import { InjectRedis, RedisClient } from '../../../lib';
import { CreateSampleDto } from './dto/create-sample.dto';

@Injectable()
export class SamplesService {
  constructor(
    @InjectRedis() private readonly redis: RedisClient,
    @InjectRedis('conn2') private readonly redis2: RedisClient,
  ) {}

  async createDefault(dto: CreateSampleDto) {
    return this.redis
      .pipeline()
      .hset(this.key, dto.id, JSON.stringify(dto))
      .hget(this.key, dto.id)
      .exec()
      .then(([, [, result]]) => JSON.parse(result));
  }

  async createNamed(dto: CreateSampleDto) {
    return this.redis2
      .pipeline()
      .hset(this.key, dto.id, JSON.stringify(dto))
      .hget(this.key, dto.id)
      .exec()
      .then(([, [, result]]) => JSON.parse(result));
  }

  get key() {
    return 'sample-key';
  }
}
