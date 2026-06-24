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
  ApiResponse,
} from '@nestjs/swagger';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { ErrorResponseDto } from '../common/dto/error-response.dto';

@ApiTags('organizations')
@Controller('organizations')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @ApiOperation({ summary: 'Create a new organization' })
  @ApiCreatedResponse({ description: 'Organization created successfully' })
  @ApiResponse({ status: 400, type: ErrorResponseDto })
  @ApiResponse({ status: 500, type: ErrorResponseDto })
  @Post()
  create(@Body() createOrganizationDto: CreateOrganizationDto) {
    return this.organizationService.create(createOrganizationDto);
  }

  @ApiOperation({ summary: 'List all organizations' })
  @ApiOkResponse({ description: 'Organizations returned successfully' })
  @ApiResponse({ status: 500, type: ErrorResponseDto })
  @Get()
  findAll() {
    return this.organizationService.findAll();
  }

  @ApiOperation({ summary: 'Get an organization by id' })
  @ApiParam({ name: 'id', type: Number, description: 'Organization id' })
  @ApiOkResponse({ description: 'Organization returned successfully' })
  @ApiResponse({ status: 400, type: ErrorResponseDto })
  @ApiResponse({ status: 404, type: ErrorResponseDto })
  @ApiResponse({ status: 500, type: ErrorResponseDto })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.organizationService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update an organization by id' })
  @ApiParam({ name: 'id', type: Number, description: 'Organization id' })
  @ApiOkResponse({ description: 'Organization updated successfully' })
  @ApiResponse({ status: 400, type: ErrorResponseDto })
  @ApiResponse({ status: 404, type: ErrorResponseDto })
  @ApiResponse({ status: 500, type: ErrorResponseDto })
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
  @ApiResponse({ status: 400, type: ErrorResponseDto })
  @ApiResponse({ status: 404, type: ErrorResponseDto })
  @ApiResponse({ status: 500, type: ErrorResponseDto })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.organizationService.remove(+id);
  }
}
