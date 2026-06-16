import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty({ example: 'ABC Logistics' })
  name!: string;

  @ApiProperty({ example: 'Ravi Kumar' })
  contact_name!: string;

  @ApiProperty({ example: 'ravi@example.com' })
  email!: string;

  @ApiProperty({ example: '+91-9999999999' })
  phone!: string;

  @ApiProperty({ example: '123 Industrial Park' })
  address!: string;

  @ApiProperty({ example: 'Bengaluru' })
  city!: string;

  @ApiProperty({ example: 'Karnataka' })
  state!: string;

  @ApiProperty({ example: '560001' })
  zip!: string;

  @ApiPropertyOptional({ example: 'Prefer deliveries after 10 AM' })
  notes?: string;
}
