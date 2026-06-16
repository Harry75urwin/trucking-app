import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@ApiTags('organizations')
@Controller('organizations')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @ApiOperation({ summary: 'Create a new organization' })
  @ApiCreatedResponse({ description: 'Organization created successfully' })
  @Post()
  create(@Body() createOrganizationDto: CreateOrganizationDto) {
    return this.organizationService.create(createOrganizationDto);
  }

  @ApiOperation({ summary: 'List all organizations' })
  @ApiOkResponse({ description: 'Organizations returned successfully' })
  @Get()
  findAll() {
    return this.organizationService.findAll();
  }

  @ApiOperation({ summary: 'Get an organization by id' })
  @ApiParam({ name: 'id', type: Number, description: 'Organization id' })
  @ApiOkResponse({ description: 'Organization returned successfully' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.organizationService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update an organization by id' })
  @ApiParam({ name: 'id', type: Number, description: 'Organization id' })
  @ApiOkResponse({ description: 'Organization updated successfully' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ) {
    return this.organizationService.update(+id, updateOrganizationDto);
  }

  @ApiOperation({ summary: 'Delete an organization by id' })
  @ApiParam({ name: 'id', type: Number, description: 'Organization id' })
  @ApiOkResponse({ description: 'Organization deleted successfully' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.organizationService.remove(+id);
  }
}
