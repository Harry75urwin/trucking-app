import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
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

@ApiTags('tracking')
@Controller('tracking')
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @ApiOperation({ summary: 'Create a tracking event' })
  @ApiCreatedResponse({ description: 'Tracking event created successfully' })
  @Post()
  create(@Body() createTrackingEventDto: CreateTrackingEventDto) {
    return this.trackingService.create(createTrackingEventDto);
  }

  @ApiOperation({ summary: 'List tracking events' })
  @ApiOkResponse({ description: 'Tracking events returned successfully' })
  @Get()
  findAll() {
    return this.trackingService.findAll();
  }

  @ApiOperation({ summary: 'Get a tracking event by id' })
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'Tracking event returned successfully' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.trackingService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a tracking event by id' })
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
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'Tracking event deleted successfully' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.trackingService.remove(id);
  }
}
