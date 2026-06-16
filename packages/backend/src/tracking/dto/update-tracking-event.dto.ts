import { PartialType } from '@nestjs/swagger';
import { CreateTrackingEventDto } from './create-tracking-event.dto';

export class UpdateTrackingEventDto extends PartialType(
  CreateTrackingEventDto,
) {}
