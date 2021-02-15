import { Module } from '@nestjs/common';
import { RedisModule } from '../../../lib/redis.module';
import { SentinelController } from './sentinel.controller';
import { SentinelService } from './sentinel.service';

@Module({
  imports: [
    RedisModule.forRoot({
      clientName: 'sentinel',
      name: 'mymaster',
      sentinels: [
        {
          host: 'localhost',
          port: 26379,
        },
        {
          host: 'localhost',
          port: 26380,
        },
      ],
    }),
  ],
  controllers: [SentinelController],
  providers: [SentinelService],
})
export class SentinelModule {}
