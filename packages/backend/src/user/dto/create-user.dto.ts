import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
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

  @ApiPropertyOptional({ example: 'admin' })
  role?: string;

  @ApiPropertyOptional({ example: 1 })
  organizationId?: number;

  @ApiPropertyOptional({ example: true })
  isActive?: boolean;
}
