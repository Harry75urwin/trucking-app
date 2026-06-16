import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackingController } from './tracking.controller';
import { TrackingService } from './tracking.service';
import { TrackingEvent } from './entities/tracking-event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TrackingEvent])],
  controllers: [TrackingController],
  providers: [TrackingService],
})
export class TrackingModule {}
