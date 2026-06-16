import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLoadAssignmentDto {
  @ApiProperty({ example: 'load-uuid-123' })
  load_id!: string;

  @ApiPropertyOptional({ example: 'driver-uuid-123' })
  driver_id?: string | null;

  @ApiPropertyOptional({ example: 'truck-uuid-123' })
  truck_id?: string | null;

  @ApiPropertyOptional({ example: 'trailer-uuid-123' })
  trailer_id?: string | null;
}
