import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DispatchController } from './dispatch.controller';
import { DispatchService } from './dispatch.service';
import { Dispatch } from './entities/dispatch.entity';
import { Load } from '../load/entities/load.entity';
import { Driver } from '../driver/entities/driver.entity';
import { Vehicle } from '../vehicle/entities/vehicle.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Dispatch, Load, Driver, Vehicle])],
  controllers: [DispatchController],
  providers: [DispatchService],
})
export class DispatchModule {}
