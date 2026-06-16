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
import { CreateLoadAssignmentDto } from './dto/create-load-assignment.dto';
import { UpdateLoadAssignmentDto } from './dto/update-load-assignment.dto';
import { LoadAssignmentService } from './load-assignment.service';

@ApiTags('load-assignments')
@Controller('load_assignments')
export class LoadAssignmentController {
  constructor(private readonly loadAssignmentService: LoadAssignmentService) {}

  @ApiOperation({ summary: 'Create a load assignment' })
  @ApiCreatedResponse({ description: 'Load assignment created successfully' })
  @Post()
  create(@Body() createLoadAssignmentDto: CreateLoadAssignmentDto) {
    return this.loadAssignmentService.create(createLoadAssignmentDto);
  }

  @ApiOperation({ summary: 'List all load assignments' })
  @ApiOkResponse({ description: 'Load assignments returned successfully' })
  @Get()
  findAll() {
    return this.loadAssignmentService.findAll();
  }

  @ApiOperation({ summary: 'Get a load assignment by id' })
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'Load assignment returned successfully' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.loadAssignmentService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a load assignment by id' })
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'Load assignment updated successfully' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLoadAssignmentDto: UpdateLoadAssignmentDto,
  ) {
    return this.loadAssignmentService.update(id, updateLoadAssignmentDto);
  }

  @ApiOperation({ summary: 'Delete a load assignment by id' })
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'Load assignment deleted successfully' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.loadAssignmentService.remove(id);
  }
}
