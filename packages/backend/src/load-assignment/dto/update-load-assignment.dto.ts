import { PartialType } from '@nestjs/swagger';
import { CreateLoadAssignmentDto } from './create-load-assignment.dto';

export class UpdateLoadAssignmentDto extends PartialType(
  CreateLoadAssignmentDto,
) {}
