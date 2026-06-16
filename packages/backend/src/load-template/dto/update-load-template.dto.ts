import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateLoadTemplateDto } from './create-load-template.dto';

export class UpdateLoadTemplateDto extends PartialType(
  OmitType(CreateLoadTemplateDto, ['organization_id'] as const),
) {}
