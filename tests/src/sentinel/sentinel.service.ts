import { Injectable } from '@nestjs/common';
import { InjectRedis, RedisClient } from '../../../lib';
import { CreateDto } from './dto/create.dto';

@Injectable()
export class SentinelService {
  constructor(@InjectRedis('sentinel') private readonly redis: RedisClient) {}

  async create(dto: CreateDto) {
    return this.redis
      .pipeline()
      .set(this.key, JSON.stringify(dto))
      .get(this.key)
      .exec()
      .then(([, [, result]]) => JSON.parse(result));
  }

  get key() {
    return 'sample-sentinel-key';
  }
}
