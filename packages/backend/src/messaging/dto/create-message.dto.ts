import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty({ example: 'conv-uuid-1234' })
  conversationId!: string;

  @ApiProperty({ example: 1 })
  senderId!: number;

  @ApiProperty({ example: 2 })
  receiverId!: number;

  @ApiProperty({ example: 'Hello, when will the load be picked up?' })
  body!: string;

  @ApiPropertyOptional({ example: 'https://example.com/doc.pdf' })
  attachmentUrl?: string;
}
