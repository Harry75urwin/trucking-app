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
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { VehicleService } from './vehicle.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

const OPERATIONS_ROLES = ['admin', 'dispatcher', 'fleet_manager'];

@ApiTags('vehicles')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('vehicles')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @ApiOperation({ summary: 'Create a vehicle' })
  @Roles(...OPERATIONS_ROLES)
  @ApiCreatedResponse({ description: 'Vehicle created successfully' })
  @Post()
  create(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehicleService.create(createVehicleDto);
  }

  @ApiOperation({ summary: 'List all vehicles' })
  @Roles(...OPERATIONS_ROLES)
  @ApiOkResponse({ description: 'Vehicles returned successfully' })
  @Get()
  findAll() {
    return this.vehicleService.findAll();
  }

  @ApiOperation({ summary: 'Get a vehicle by id' })
  @Roles(...OPERATIONS_ROLES)
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'Vehicle returned successfully' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vehicleService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a vehicle by id' })
  @Roles(...OPERATIONS_ROLES)
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'Vehicle updated successfully' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVehicleDto: UpdateVehicleDto) {
    return this.vehicleService.update(id, updateVehicleDto);
  }

  @ApiOperation({ summary: 'Delete a vehicle by id' })
  @Roles(...OPERATIONS_ROLES)
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'Vehicle deleted successfully' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vehicleService.remove(id);
  }
}
