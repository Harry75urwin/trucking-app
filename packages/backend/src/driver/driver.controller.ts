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
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { DriverService } from './driver.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ErrorResponseDto } from '../common/dto/error-response.dto';

const OPERATIONS_ROLES = ['admin', 'dispatcher', 'fleet_manager'];

@ApiTags('drivers')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('drivers')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @ApiOperation({ summary: 'Create a driver' })
  @Roles(...OPERATIONS_ROLES)
  @ApiCreatedResponse({ description: 'Driver created successfully' })
  @ApiResponse({ status: 400, type: ErrorResponseDto })
  @ApiResponse({ status: 401, type: ErrorResponseDto })
  @ApiResponse({ status: 403, type: ErrorResponseDto })
  @ApiResponse({ status: 500, type: ErrorResponseDto })
  @Post()
  create(@Body() createDriverDto: CreateDriverDto) {
    return this.driverService.create(createDriverDto);
  }

  @ApiOperation({ summary: 'List all drivers' })
  @Roles(...OPERATIONS_ROLES)
  @ApiOkResponse({ description: 'Drivers returned successfully' })
  @ApiResponse({ status: 401, type: ErrorResponseDto })
  @ApiResponse({ status: 403, type: ErrorResponseDto })
  @ApiResponse({ status: 500, type: ErrorResponseDto })
  @Get()
  findAll() {
    return this.driverService.findAll();
  }

  @ApiOperation({ summary: 'Get a driver by id' })
  @Roles(...OPERATIONS_ROLES)
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'Driver returned successfully' })
  @ApiResponse({ status: 400, type: ErrorResponseDto })
  @ApiResponse({ status: 401, type: ErrorResponseDto })
  @ApiResponse({ status: 403, type: ErrorResponseDto })
  @ApiResponse({ status: 404, type: ErrorResponseDto })
  @ApiResponse({ status: 500, type: ErrorResponseDto })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.driverService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a driver by id' })
  @Roles(...OPERATIONS_ROLES)
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'Driver updated successfully' })
  @ApiResponse({ status: 400, type: ErrorResponseDto })
  @ApiResponse({ status: 401, type: ErrorResponseDto })
  @ApiResponse({ status: 403, type: ErrorResponseDto })
  @ApiResponse({ status: 404, type: ErrorResponseDto })
  @ApiResponse({ status: 500, type: ErrorResponseDto })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDriverDto: UpdateDriverDto) {
    return this.driverService.update(id, updateDriverDto);
  }

  @ApiOperation({ summary: 'Delete a driver by id' })
  @Roles(...OPERATIONS_ROLES)
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'Driver deleted successfully' })
  @ApiResponse({ status: 400, type: ErrorResponseDto })
  @ApiResponse({ status: 401, type: ErrorResponseDto })
  @ApiResponse({ status: 403, type: ErrorResponseDto })
  @ApiResponse({ status: 404, type: ErrorResponseDto })
  @ApiResponse({ status: 500, type: ErrorResponseDto })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.driverService.remove(id);
  }
}
