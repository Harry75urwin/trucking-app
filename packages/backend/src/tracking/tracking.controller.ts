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
import { CreateTrackingEventDto } from './dto/create-tracking-event.dto';
import { UpdateTrackingEventDto } from './dto/update-tracking-event.dto';
import { TrackingService } from './tracking.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

const ALL_ROLES = [
  'admin',
  'dispatcher',
  'fleet_manager',
  'driver',
  'customer',
];
const TRACKING_MUTATION_ROLES = [
  'admin',
  'dispatcher',
  'fleet_manager',
  'driver',
];

@ApiTags('tracking')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tracking')
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @ApiOperation({ summary: 'Create a tracking event' })
  @Roles(...TRACKING_MUTATION_ROLES)
  @ApiCreatedResponse({ description: 'Tracking event created successfully' })
  @Post()
  create(@Body() createTrackingEventDto: CreateTrackingEventDto) {
    return this.trackingService.create(createTrackingEventDto);
  }

  @ApiOperation({ summary: 'List tracking events' })
  @Roles(...ALL_ROLES)
  @ApiOkResponse({ description: 'Tracking events returned successfully' })
  @Get()
  findAll() {
    return this.trackingService.findAll();
  }

  @ApiOperation({ summary: 'Get a tracking event by id' })
  @Roles(...ALL_ROLES)
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'Tracking event returned successfully' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.trackingService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a tracking event by id' })
  @Roles(...TRACKING_MUTATION_ROLES)
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'Tracking event updated successfully' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTrackingEventDto: UpdateTrackingEventDto,
  ) {
    return this.trackingService.update(id, updateTrackingEventDto);
  }

  @ApiOperation({ summary: 'Delete a tracking event by id' })
  @Roles(...TRACKING_MUTATION_ROLES)
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'Tracking event deleted successfully' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.trackingService.remove(id);
  }
}
