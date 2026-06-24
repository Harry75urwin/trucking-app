import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateStaticDataDto {
  @ApiProperty()
  category!: string;

  @ApiProperty()
  key!: string;

  @ApiProperty()
  value!: string;

  @ApiPropertyOptional()
  display_en?: string;

  @ApiPropertyOptional()
  display_hi?: string;

  @ApiPropertyOptional()
  sort_order?: number;

  @ApiPropertyOptional()
  organization_id?: string;
}
