import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: '+91-9000000001' })
  phoneNumber!: string;

  @ApiProperty({ example: 'StrongPassword123!' })
  password!: string;
}
