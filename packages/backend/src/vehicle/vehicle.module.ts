import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleService } from './vehicle.service';
import { VehicleController } from './vehicle.controller';
import { Vehicle } from './entities/vehicle.entity';
import { Driver } from '../driver/entities/driver.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle, Driver])],
  controllers: [VehicleController],
  providers: [VehicleService],
})
export class VehicleModule {}
