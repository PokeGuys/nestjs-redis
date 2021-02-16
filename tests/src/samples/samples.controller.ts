import { Body, Controller, Post } from '@nestjs/common';
import { CreateSampleDto } from './dto/create-sample.dto';
import { SamplesService } from './samples.service';

@Controller('samples')
export class SamplesController {
  constructor(private readonly samplesService: SamplesService) {}

  @Post('default')
  async createDefaultConnection(@Body() createSampleDto: CreateSampleDto) {
    return this.samplesService.createDefault(createSampleDto);
  }
}
