import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { Vehicle } from './entities/vehicle.entity';
import { DEMO_VEHICLES } from '../demo/demo-data';

@Injectable()
export class VehicleService implements OnModuleInit {
  constructor(
    @InjectRepository(Vehicle)
    private vehicleRepository: Repository<Vehicle>,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    if (this.isDemoDataEnabled()) {
      const count = await this.vehicleRepository.count();
      if (count === 0) {
        await this.vehicleRepository.save(DEMO_VEHICLES);
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

  create(createVehicleDto: CreateVehicleDto) {
    const vehicle = this.vehicleRepository.create(createVehicleDto);
    return this.vehicleRepository.save(vehicle);
  }

  findAll() {
    return this.vehicleRepository.find();
  }

  findOne(id: string) {
    return this.vehicleRepository.findOne({ where: { id } });
  }

  async update(id: string, updateVehicleDto: UpdateVehicleDto) {
    await this.vehicleRepository.update(id, updateVehicleDto);
    return this.vehicleRepository.findOne({ where: { id } });
  }

  remove(id: string) {
    return this.vehicleRepository.delete(id);
  }
}
