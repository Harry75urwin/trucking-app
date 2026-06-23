import { Controller, Get, Query, Param } from '@nestjs/common';
import { StaticDataService } from './static-data.service';

@Controller('static-data')
export class StaticDataController {
  constructor(private readonly staticDataService: StaticDataService) {}

  @Get()
  findAll(@Query('category') category?: string) {
    return this.staticDataService.findAll(category);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.staticDataService.findOne(id);
  }
}
