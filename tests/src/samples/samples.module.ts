import { Module } from '@nestjs/common';
import { SamplesController } from './samples.controller';
import { SamplesService } from './samples.service';

@Module({
  controllers: [SamplesController],
  providers: [SamplesService],
})
export class SamplesModule {}
