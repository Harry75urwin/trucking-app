import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiResponse,
} from '@nestjs/swagger';
import { CreateLoadDto } from './dto/create-load.dto';
import { UpdateLoadDto } from './dto/update-load.dto';
import { LoadService } from './load.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ErrorResponseDto } from '../common/dto/error-response.dto';

const ALL_ROLES = [
  'admin',
  'dispatcher',
  'fleet_manager',
  'driver',
  'customer',
];
const OPERATIONS_ROLES = ['admin', 'dispatcher', 'fleet_manager'];

@ApiTags('loads')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('loads')
export class LoadController {
  constructor(private readonly loadService: LoadService) {}

  @ApiOperation({ summary: 'Create a load' })
  @Roles(...OPERATIONS_ROLES)
  @ApiCreatedResponse({ description: 'Load created successfully' })
  @ApiResponse({ status: 400, type: ErrorResponseDto })
  @ApiResponse({ status: 401, type: ErrorResponseDto })
  @ApiResponse({ status: 403, type: ErrorResponseDto })
  @ApiResponse({ status: 500, type: ErrorResponseDto })
  @Post()
  create(@Body() createLoadDto: CreateLoadDto) {
    return this.loadService.create(createLoadDto);
  }

  @ApiOperation({ summary: 'List all loads' })
  @Roles(...ALL_ROLES)
  @ApiOkResponse({ description: 'Loads returned successfully' })
  @ApiResponse({ status: 401, type: ErrorResponseDto })
  @ApiResponse({ status: 403, type: ErrorResponseDto })
  @ApiResponse({ status: 500, type: ErrorResponseDto })
  @Get()
  findAll() {
    return this.loadService.findAll();
  }

  @ApiOperation({ summary: 'Get a load by id' })
  @Roles(...ALL_ROLES)
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'Load returned successfully' })
  @ApiResponse({ status: 400, type: ErrorResponseDto })
  @ApiResponse({ status: 401, type: ErrorResponseDto })
  @ApiResponse({ status: 403, type: ErrorResponseDto })
  @ApiResponse({ status: 404, type: ErrorResponseDto })
  @ApiResponse({ status: 500, type: ErrorResponseDto })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.loadService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a load by id' })
  @Roles(...OPERATIONS_ROLES)
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'Load updated successfully' })
  @ApiResponse({ status: 400, type: ErrorResponseDto })
  @ApiResponse({ status: 401, type: ErrorResponseDto })
  @ApiResponse({ status: 403, type: ErrorResponseDto })
  @ApiResponse({ status: 404, type: ErrorResponseDto })
  @ApiResponse({ status: 500, type: ErrorResponseDto })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLoadDto: UpdateLoadDto) {
    return this.loadService.update(id, updateLoadDto);
  }

  @ApiOperation({ summary: 'Delete a load by id' })
  @Roles(...OPERATIONS_ROLES)
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'Load deleted successfully' })
  @ApiResponse({ status: 400, type: ErrorResponseDto })
  @ApiResponse({ status: 401, type: ErrorResponseDto })
  @ApiResponse({ status: 403, type: ErrorResponseDto })
  @ApiResponse({ status: 404, type: ErrorResponseDto })
  @ApiResponse({ status: 500, type: ErrorResponseDto })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.loadService.remove(id);
  }
}
