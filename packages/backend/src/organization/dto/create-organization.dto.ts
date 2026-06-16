import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Data required to create a new organization.
 * Keep this focused on fields that are commonly stored on an organization profile.
 */
export class CreateOrganizationDto {
  @ApiProperty({ example: 'Acme Corp' })
  name!: string;

  @ApiProperty({ example: 'contact@acme.com' })
  email!: string;

  @ApiPropertyOptional({ example: '+91-8888888888' })
  phoneNumber?: string;

  @ApiPropertyOptional({ example: 'https://acme.com' })
  website?: string;

  @ApiPropertyOptional({ example: '42 Business Road' })
  address?: string;

  @ApiPropertyOptional({ example: 'Bengaluru' })
  city?: string;

  @ApiPropertyOptional({ example: 'Karnataka' })
  state?: string;

  @ApiPropertyOptional({ example: 'India' })
  country?: string;

  @ApiPropertyOptional({ example: '560001' })
  postalCode?: string;

  @ApiPropertyOptional({ example: 'Technology and consulting services' })
  description?: string;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/logo.png' })
  logoUrl?: string;

  @ApiPropertyOptional({ example: 1 })
  ownerUserId?: number;

  @ApiPropertyOptional({ example: true })
  isActive?: boolean;
}
