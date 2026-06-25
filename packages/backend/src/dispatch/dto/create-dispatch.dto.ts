import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDispatchDto {
  @ApiProperty({ example: 'load-uuid-123' })
  loadId!: string;

  @ApiProperty({ example: 'driver-uuid-123' })
  driverId!: string;

  @ApiProperty({ example: 'vehicle-uuid-123' })
  vehicleId!: string;

  @ApiPropertyOptional({ example: 1 })
  organizationId?: number;

  @ApiPropertyOptional({ example: '2026-06-12T06:00:00.000Z' })
  scheduledAt?: string;

  @ApiPropertyOptional({ example: 'planned' })
  status?: string;

  @ApiPropertyOptional({ example: 'Match driver with refrigerated vehicle' })
  notes?: string;
}
