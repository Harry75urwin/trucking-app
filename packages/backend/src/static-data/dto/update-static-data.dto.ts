import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateStaticDataDto {
  @ApiPropertyOptional()
  value?: string;

  @ApiPropertyOptional()
  display_en?: string;

  @ApiPropertyOptional()
  display_hi?: string;

  @ApiPropertyOptional()
  sort_order?: number;

  @ApiPropertyOptional()
  is_active?: boolean;
}
