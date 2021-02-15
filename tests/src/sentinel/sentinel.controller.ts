import { Body, Controller, Post } from '@nestjs/common';
import { CreateDto } from './dto/create.dto';
import { SentinelService } from './sentinel.service';

@Controller('sentinel')
export class SentinelController {
  constructor(private readonly sentinelService: SentinelService) {}

  @Post()
  async create(@Body() dto: CreateDto) {
    return this.sentinelService.create(dto);
  }
}
