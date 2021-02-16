import { Injectable } from '@nestjs/common';
import { InjectRedis, RedisClient } from '../../../lib';
import { CreateSampleDto } from './dto/create-sample.dto';

@Injectable()
export class SamplesService {
  constructor(@InjectRedis() private readonly redis: RedisClient) {}

  async createDefault(dto: CreateSampleDto) {
    return this.redis
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
