import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export type UploadKind = 'load' | 'vehicle' | 'organization-logo';

export class CreatePresignedUploadDto {
  @ApiProperty({ enum: ['load', 'vehicle', 'organization-logo'] })
  kind!: UploadKind;

  @ApiProperty({ example: 'load-photo.jpg' })
  fileName!: string;

  @ApiPropertyOptional({ example: 'image/jpeg' })
  contentType?: string;
}
