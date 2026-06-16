import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateVehicleDto {
  @ApiProperty({ example: 'TRK-001' })
  unit_number!: string;

  @ApiProperty({ example: 'truck' })
  type!: string;

  @ApiProperty({ example: 2024 })
  year!: number;

  @ApiProperty({ example: 'Tata' })
  make!: string;

  @ApiProperty({ example: 'Prima' })
  model!: string;

  @ApiProperty({ example: 'KA-01-AB-1234' })
  license_plate!: string;

  @ApiProperty({ example: 120000 })
  mileage!: number;

  @ApiProperty({ example: 130000 })
  next_service_miles!: number;

  @ApiPropertyOptional({ example: ['https://cdn.example.com/truck.jpg'] })
  imageUrls?: string[];

  @ApiPropertyOptional({ example: 'active' })
  status?: string;
}
