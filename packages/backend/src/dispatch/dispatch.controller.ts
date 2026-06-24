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
  ApiResponse,
} from '@nestjs/swagger';
import { CreateDispatchDto } from './dto/create-dispatch.dto';
import { UpdateDispatchDto } from './dto/update-dispatch.dto';
import { DispatchService } from './dispatch.service';
import { ErrorResponseDto } from '../common/dto/error-response.dto';

@ApiTags('dispatches')
@Controller('dispatches')
export class DispatchController {
  constructor(private readonly dispatchService: DispatchService) {}

  @ApiOperation({ summary: 'Create a dispatch' })
  @ApiCreatedResponse({ description: 'Dispatch created successfully' })
  @ApiResponse({ status: 400, type: ErrorResponseDto })
  @ApiResponse({ status: 500, type: ErrorResponseDto })
  @Post()
  create(@Body() createDispatchDto: CreateDispatchDto) {
    return this.dispatchService.create(createDispatchDto);
  }

  @ApiOperation({ summary: 'List all dispatches' })
  @ApiOkResponse({ description: 'Dispatches returned successfully' })
  @ApiResponse({ status: 500, type: ErrorResponseDto })
  @Get()
  findAll() {
    return this.dispatchService.findAll();
  }

  @ApiOperation({ summary: 'Get a dispatch by id' })
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'Dispatch returned successfully' })
  @ApiResponse({ status: 400, type: ErrorResponseDto })
  @ApiResponse({ status: 404, type: ErrorResponseDto })
  @ApiResponse({ status: 500, type: ErrorResponseDto })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dispatchService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a dispatch by id' })
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'Dispatch updated successfully' })
  @ApiResponse({ status: 400, type: ErrorResponseDto })
  @ApiResponse({ status: 404, type: ErrorResponseDto })
  @ApiResponse({ status: 500, type: ErrorResponseDto })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDispatchDto: UpdateDispatchDto,
  ) {
    return this.dispatchService.update(id, updateDispatchDto);
  }

  @ApiOperation({ summary: 'Delete a dispatch by id' })
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ description: 'Dispatch deleted successfully' })
  @ApiResponse({ status: 400, type: ErrorResponseDto })
  @ApiResponse({ status: 404, type: ErrorResponseDto })
  @ApiResponse({ status: 500, type: ErrorResponseDto })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dispatchService.remove(id);
  }
}
