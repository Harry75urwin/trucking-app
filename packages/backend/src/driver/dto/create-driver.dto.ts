import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDriverDto {
  @ApiProperty({ example: 'Amit' })
  first_name!: string;

  @ApiProperty({ example: 'Sharma' })
  last_name!: string;

  @ApiProperty({ example: 'amit.sharma@example.com' })
  email!: string;

  @ApiProperty({ example: '+91-9000000000' })
  phone!: string;

  @ApiProperty({ example: 'DL-2026-000123' })
  cdl_number!: string;

  @ApiPropertyOptional({ example: '2027-12-31' })
  cdl_expiry?: string;

  @ApiPropertyOptional({ example: '2027-12-31' })
  medical_expiry?: string;

  @ApiPropertyOptional({ example: 'Bengaluru' })
  home_city?: string;

  @ApiPropertyOptional({ example: 'Karnataka' })
  home_state?: string;

  @ApiPropertyOptional({
    example: 'available',
    description: 'available, on_load, off_duty',
  })
  status?: string;
}
