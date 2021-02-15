import { Module } from '@nestjs/common';
import { RedisModule } from '../../lib';
import { SamplesModule } from './samples/samples.module';

@Module({
  imports: [
    RedisModule.forRoot({
      uri: 'redis://127.0.0.1:6379/',
    }),
    RedisModule.forRoot({
      clientName: 'conn2',
      uri: 'redis://localhost:6379/',
    }),
    SamplesModule,
  ],
})
export class AppModule {}
