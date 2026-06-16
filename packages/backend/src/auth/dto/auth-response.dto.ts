import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AuthOrganizationResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'Fast Cargo Logistics' })
  name!: string;

  @ApiProperty({ example: 'ops@fastcargo.com' })
  email!: string;

  @ApiPropertyOptional({ example: '+91-8888888888' })
  phoneNumber?: string;

  @ApiPropertyOptional({ example: 'https://fastcargo.com' })
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

  @ApiPropertyOptional({
    example: 'Freight, dispatch, and fleet tracking services',
  })
  description?: string;

  @ApiPropertyOptional({ example: 1 })
  ownerUserId?: number;
}

export class AuthUserResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'Jane' })
  firstName!: string;

  @ApiProperty({ example: 'Doe' })
  lastName!: string;

  @ApiProperty({ example: 'jane.doe@example.com' })
  email!: string;

  @ApiPropertyOptional({ example: '+91-9999999999' })
  phoneNumber?: string;

  @ApiPropertyOptional({ example: 'driver' })
  role?: string;

  @ApiPropertyOptional({ example: 1 })
  organizationId?: number;

  @ApiPropertyOptional({ example: true })
  isActive?: boolean;

  @ApiPropertyOptional({ example: '2026-06-11T10:00:00.000Z' })
  createdAt?: string;

  @ApiPropertyOptional({ example: '2026-06-11T10:00:00.000Z' })
  updatedAt?: string;
}

export class AuthResponseDto {
  @ApiProperty({ example: 'Signup successful' })
  message!: string;

  @ApiProperty({
    example: 'eyJzdWIiOjEsImVtYWlsIjoiamFuZS5kb2VAZXhhbXBsZS5jb20ifQ',
  })
  accessToken!: string;

  @ApiProperty({ type: () => AuthUserResponseDto })
  user!: AuthUserResponseDto;

  @ApiPropertyOptional({
    type: () => AuthOrganizationResponseDto,
    nullable: true,
  })
  organization?: AuthOrganizationResponseDto | null;
}
