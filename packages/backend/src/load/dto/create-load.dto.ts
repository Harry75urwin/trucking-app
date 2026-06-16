import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLoadDto {
  @ApiProperty({ example: 'LD-1001' })
  load_number!: string;

  @ApiProperty({ example: 'customer-uuid-1234' })
  customer_id!: string;

  @ApiProperty({ example: 'Delhi' })
  origin_city!: string;

  @ApiProperty({ example: 'Karnataka' })
  origin_state!: string;

  @ApiProperty({ example: 'Mumbai' })
  destination_city!: string;

  @ApiProperty({ example: 'Maharashtra' })
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

  @ApiPropertyOptional({ example: 26500 })
  total_revenue?: number;

  @ApiPropertyOptional({ example: 'Handle with care' })
  notes?: string;

  @ApiPropertyOptional({ example: ['https://cdn.example.com/load.jpg'] })
  imageUrls?: string[];

  @ApiPropertyOptional({ example: 'pending' })
  status?: string;
}
