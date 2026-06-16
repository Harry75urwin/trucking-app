import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateConversationDto {
  @ApiPropertyOptional({ example: 'load-uuid-1234' })
  loadId?: string;

  @ApiPropertyOptional({ example: 1 })
  organizationId?: number;

  @ApiProperty({ example: 1 })
  createdBy!: number;

  @ApiProperty({ example: 2 })
  receiverId!: number;
}
