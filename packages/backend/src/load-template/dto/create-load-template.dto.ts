import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLoadTemplateDto {
  @ApiProperty({ example: 'Mumbai-Delhi Electronics' })
  name!: string;

  @ApiProperty({ example: 'Mumbai' })
  origin_city!: string;

  @ApiProperty({ example: 'Maharashtra' })
  origin_state!: string;

  @ApiProperty({ example: 'Delhi' })
  destination_city!: string;

  @ApiProperty({ example: 'Delhi' })
  destination_state!: string;

  @ApiPropertyOptional({ example: '2026-06-12' })
  pickup_date?: string;

  @ApiPropertyOptional({ example: '2026-06-14' })
  delivery_date?: string;

  @ApiProperty({ example: 'Electronics' })
  commodity!: string;

  @ApiProperty({ example: 12000 })
  weight_lbs!: number;

  @ApiProperty({ example: 650 })
  miles!: number;

  @ApiProperty({ example: 2500 })
  rate!: number;

  @ApiProperty({ example: 150 })
  fuel_surcharge!: number;

  @ApiProperty({ example: 50 })
  detention!: number;

  @ApiPropertyOptional({ example: 'Handle with care' })
  notes?: string;

  @ApiProperty({ example: '1' })
  organization_id!: string;
}
