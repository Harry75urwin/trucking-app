import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { CreateTrackingEventDto } from './dto/create-tracking-event.dto';
import { UpdateTrackingEventDto } from './dto/update-tracking-event.dto';
import { TrackingEvent } from './entities/tracking-event.entity';
import { DEMO_TRACKING_EVENTS } from '../demo/demo-data';

@Injectable()
export class TrackingService implements OnModuleInit {
  constructor(
    @InjectRepository(TrackingEvent)
    private trackingRepository: Repository<TrackingEvent>,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    if (this.isDemoDataEnabled()) {
      const count = await this.trackingRepository.count();
      if (count === 0) {
        await this.trackingRepository.save(DEMO_TRACKING_EVENTS);
      }
    }
  }

  private isDemoDataEnabled() {
    return ['1', 'true', 'yes'].includes(
      (this.configService.get<string>('DEMO_DATA_ENABLED') ?? '')
        .trim()
        .toLowerCase(),
    );
  }

  create(createTrackingEventDto: CreateTrackingEventDto) {
    if (!createTrackingEventDto.loadId && !createTrackingEventDto.vehicleId) {
      throw new BadRequestException('loadId or vehicleId is required');
    }

    const event = this.trackingRepository.create(createTrackingEventDto);
    return this.trackingRepository.save(event);
  }

  findAll() {
    return this.trackingRepository.find();
  }

  findOne(id: string) {
    return this.trackingRepository.findOne({ where: { id } });
  }

  update(id: string, updateTrackingEventDto: UpdateTrackingEventDto) {
    return this.trackingRepository.update(id, updateTrackingEventDto);
  }

  remove(id: string) {
    return this.trackingRepository.delete(id);
  }
}
