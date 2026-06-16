import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTrackingEventDto {
  @ApiProperty({ example: 'load-uuid-123' })
  loadId!: string;

  @ApiPropertyOptional({ example: 'vehicle-uuid-123' })
  vehicleId?: string;

  @ApiPropertyOptional({ example: 'driver-uuid-123' })
  driverId?: string;

  @ApiProperty({ example: 28.6139 })
  latitude!: number;

  @ApiProperty({ example: 77.209 })
  longitude!: number;

  @ApiPropertyOptional({ example: 'Delhi NCR' })
  locationName?: string;

  @ApiPropertyOptional({ example: 'in_transit' })
  status?: string;

  @ApiPropertyOptional({ example: 'Reached toll gate' })
  note?: string;
}
