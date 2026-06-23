import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerService } from './customer.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

const CUSTOMER_ADMIN_ROLES = ['admin', 'dispatcher'];

@ApiTags('customers')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @ApiOperation({ summary: 'Create a customer' })
  @Roles(...CUSTOMER_ADMIN_ROLES)
  @ApiCreatedResponse({ description: 'Customer created successfully' })
  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customerService.create(createCustomerDto);
  }

  @ApiOperation({ summary: 'List all customers' })
  @Roles(...CUSTOMER_ADMIN_ROLES)
  @ApiOkResponse({ description: 'Customers returned successfully' })
  @Get()
  findAll(@Query('name') name?: string) {
    return this.customerService.findAll(name);
  }

  @ApiOperation({ summary: 'Get a customer by id' })
  @Roles(...CUSTOMER_ADMIN_ROLES)
  @ApiParam({ name: 'id', type: String, description: 'Customer id' })
  @ApiOkResponse({ description: 'Customer returned successfully' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customerService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a customer by id' })
  @Roles(...CUSTOMER_ADMIN_ROLES)
  @ApiParam({ name: 'id', type: String, description: 'Customer id' })
  @ApiOkResponse({ description: 'Customer updated successfully' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customerService.update(id, updateCustomerDto);
  }

  @ApiOperation({ summary: 'Delete a customer by id' })
  @Roles(...CUSTOMER_ADMIN_ROLES)
  @ApiParam({ name: 'id', type: String, description: 'Customer id' })
  @ApiOkResponse({ description: 'Customer deleted successfully' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customerService.remove(id);
  }
}
