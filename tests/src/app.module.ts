import { Module } from '@nestjs/common';
import { RedisModule } from '../../lib';
import { SamplesModule } from './samples/samples.module';

@Module({
  imports: [
    RedisModule.forRoot({
      uri: 'redis://127.0.0.1:6379/',
    }),
    SamplesModule,
  ],
})
export class AppModule {}
