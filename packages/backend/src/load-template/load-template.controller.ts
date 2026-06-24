import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { LoadTemplateService } from './load-template.service';
import { CreateLoadTemplateDto } from './dto/create-load-template.dto';
import { UpdateLoadTemplateDto } from './dto/update-load-template.dto';
import { ErrorResponseDto } from '../common/dto/error-response.dto';

@ApiTags('load-templates')
@Controller('load-templates')
export class LoadTemplateController {
  constructor(private readonly loadTemplateService: LoadTemplateService) {}

  @ApiOperation({ summary: 'Create a load template' })
  @ApiCreatedResponse({ description: 'Load template created successfully' })
  @ApiResponse({ status: 400, type: ErrorResponseDto })
  @ApiResponse({ status: 500, type: ErrorResponseDto })
  @Post()
  create(@Body() createLoadTemplateDto: CreateLoadTemplateDto) {
    return this.loadTemplateService.create(createLoadTemplateDto);
  }

  @ApiOperation({ summary: 'List all load templates' })
  @ApiOkResponse({ description: 'Load templates returned successfully' })
  @ApiResponse({ status: 400, type: ErrorResponseDto })
  @ApiResponse({ status: 500, type: ErrorResponseDto })
  @ApiQuery({ name: 'organization_id', required: false, type: String })
  @Get()
  findAll(@Query('organization_id') organizationId?: string) {
    return this.loadTemplateService.findAll(organizationId);
  }

  @ApiOperation({ summary: 'Get a load template by id' })
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'Load template returned successfully' })
  @ApiResponse({ status: 400, type: ErrorResponseDto })
  @ApiResponse({ status: 404, type: ErrorResponseDto })
  @ApiResponse({ status: 500, type: ErrorResponseDto })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.loadTemplateService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a load template by id' })
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'Load template updated successfully' })
  @ApiResponse({ status: 400, type: ErrorResponseDto })
  @ApiResponse({ status: 404, type: ErrorResponseDto })
  @ApiResponse({ status: 500, type: ErrorResponseDto })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLoadTemplateDto: UpdateLoadTemplateDto,
  ) {
    return this.loadTemplateService.update(id, updateLoadTemplateDto);
  }

  @ApiOperation({ summary: 'Delete a load template by id' })
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'Load template deleted successfully' })
  @ApiResponse({ status: 400, type: ErrorResponseDto })
  @ApiResponse({ status: 404, type: ErrorResponseDto })
  @ApiResponse({ status: 500, type: ErrorResponseDto })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.loadTemplateService.remove(id);
  }
}
