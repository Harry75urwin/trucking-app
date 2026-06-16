import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SignupDto {
  @ApiProperty({ example: 'Jane' })
  firstName!: string;

  @ApiProperty({ example: 'Doe' })
  lastName!: string;

  @ApiProperty({ example: 'jane.doe@example.com' })
  email!: string;

  @ApiProperty({ example: 'StrongPassword123!' })
  password!: string;

  @ApiPropertyOptional({ example: '+91-9999999999' })
  phoneNumber?: string;

  @ApiPropertyOptional({
    example: 'driver',
    description: 'driver, dispatcher, fleet_manager, admin',
  })
  role?: string;

  @ApiPropertyOptional({ example: 'Fast Cargo Logistics' })
  organizationName?: string;

  @ApiPropertyOptional({ example: 'ops@fastcargo.com' })
  organizationEmail?: string;

  @ApiPropertyOptional({ example: '+91-8888888888' })
  organizationPhoneNumber?: string;

  @ApiPropertyOptional({ example: 'https://fastcargo.com' })
  organizationWebsite?: string;

  @ApiPropertyOptional({ example: '42 Business Road' })
  organizationAddress?: string;

  @ApiPropertyOptional({ example: 'Bengaluru' })
  organizationCity?: string;

  @ApiPropertyOptional({ example: 'Karnataka' })
  organizationState?: string;

  @ApiPropertyOptional({ example: 'India' })
  organizationCountry?: string;

  @ApiPropertyOptional({ example: '560001' })
  organizationPostalCode?: string;

  @ApiPropertyOptional({
    example: 'Freight, dispatch, and fleet tracking services',
  })
  organizationDescription?: string;
}
