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
} from '@nestjs/swagger';
import { LoadTemplateService } from './load-template.service';
import { CreateLoadTemplateDto } from './dto/create-load-template.dto';
import { UpdateLoadTemplateDto } from './dto/update-load-template.dto';

@ApiTags('load-templates')
@Controller('load-templates')
export class LoadTemplateController {
  constructor(private readonly loadTemplateService: LoadTemplateService) {}

  @ApiOperation({ summary: 'Create a load template' })
  @ApiCreatedResponse({ description: 'Load template created successfully' })
  @Post()
  create(@Body() createLoadTemplateDto: CreateLoadTemplateDto) {
    return this.loadTemplateService.create(createLoadTemplateDto);
  }

  @ApiOperation({ summary: 'List all load templates' })
  @ApiOkResponse({ description: 'Load templates returned successfully' })
  @ApiQuery({ name: 'organization_id', required: false, type: String })
  @Get()
  findAll(@Query('organization_id') organizationId?: string) {
    return this.loadTemplateService.findAll(organizationId);
  }

  @ApiOperation({ summary: 'Get a load template by id' })
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'Load template returned successfully' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.loadTemplateService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a load template by id' })
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'Load template updated successfully' })
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
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.loadTemplateService.remove(id);
  }
}
