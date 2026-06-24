import { Controller, Get, Query, Param } from '@nestjs/common';
import { StaticDataService } from './static-data.service';
import {
  ApiOperation,
  ApiTags,
  ApiOkResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { ErrorResponseDto } from '../common/dto/error-response.dto';

@ApiTags('static-data')
@Controller('static-data')
export class StaticDataController {
  constructor(private readonly staticDataService: StaticDataService) {}

  @ApiOperation({ summary: 'List all static data' })
  @ApiOkResponse({ description: 'Static data returned successfully' })
  @ApiResponse({ status: 400, type: ErrorResponseDto })
  @ApiResponse({ status: 500, type: ErrorResponseDto })
  @Get()
  findAll(@Query('category') category?: string) {
    return this.staticDataService.findAll(category);
  }

  @ApiOperation({ summary: 'Get static data by id' })
  @ApiOkResponse({ description: 'Static data returned successfully' })
  @ApiResponse({ status: 400, type: ErrorResponseDto })
  @ApiResponse({ status: 404, type: ErrorResponseDto })
  @ApiResponse({ status: 500, type: ErrorResponseDto })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.staticDataService.findOne(id);
  }
}
