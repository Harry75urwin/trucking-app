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
} from '@nestjs/swagger';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { DriverService } from './driver.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

const OPERATIONS_ROLES = ['admin', 'dispatcher', 'fleet_manager'];

@ApiTags('drivers')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('drivers')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @ApiOperation({ summary: 'Create a driver' })
  @Roles(...OPERATIONS_ROLES)
  @ApiCreatedResponse({ description: 'Driver created successfully' })
  @Post()
  create(@Body() createDriverDto: CreateDriverDto) {
    return this.driverService.create(createDriverDto);
  }

  @ApiOperation({ summary: 'List all drivers' })
  @Roles(...OPERATIONS_ROLES)
  @ApiOkResponse({ description: 'Drivers returned successfully' })
  @Get()
  findAll() {
    return this.driverService.findAll();
  }

  @ApiOperation({ summary: 'Get a driver by id' })
  @Roles(...OPERATIONS_ROLES)
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'Driver returned successfully' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.driverService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a driver by id' })
  @Roles(...OPERATIONS_ROLES)
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'Driver updated successfully' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDriverDto: UpdateDriverDto) {
    return this.driverService.update(id, updateDriverDto);
  }

  @ApiOperation({ summary: 'Delete a driver by id' })
  @Roles(...OPERATIONS_ROLES)
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'Driver deleted successfully' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.driverService.remove(id);
  }
}
