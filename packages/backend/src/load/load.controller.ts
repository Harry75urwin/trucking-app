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
import { CreateLoadDto } from './dto/create-load.dto';
import { UpdateLoadDto } from './dto/update-load.dto';
import { LoadService } from './load.service';

@ApiTags('loads')
@Controller('loads')
export class LoadController {
  constructor(private readonly loadService: LoadService) {}

  @ApiOperation({ summary: 'Create a load' })
  @ApiCreatedResponse({ description: 'Load created successfully' })
  @Post()
  create(@Body() createLoadDto: CreateLoadDto) {
    return this.loadService.create(createLoadDto);
  }

  @ApiOperation({ summary: 'List all loads' })
  @ApiOkResponse({ description: 'Loads returned successfully' })
  @Get()
  findAll() {
    return this.loadService.findAll();
  }

  @ApiOperation({ summary: 'Get a load by id' })
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'Load returned successfully' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.loadService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a load by id' })
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'Load updated successfully' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLoadDto: UpdateLoadDto) {
    return this.loadService.update(id, updateLoadDto);
  }

  @ApiOperation({ summary: 'Delete a load by id' })
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'Load deleted successfully' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.loadService.remove(id);
  }
}
