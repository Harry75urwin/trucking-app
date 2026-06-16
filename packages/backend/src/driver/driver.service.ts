import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { Driver } from './entities/driver.entity';
import { DEMO_DRIVERS } from '../demo/demo-data';

@Injectable()
export class DriverService implements OnModuleInit {
  constructor(
    @InjectRepository(Driver)
    private driverRepository: Repository<Driver>,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    if (this.isDemoDataEnabled()) {
      const count = await this.driverRepository.count();
      if (count === 0) {
        await this.driverRepository.save(DEMO_DRIVERS);
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

  create(createDriverDto: CreateDriverDto) {
    const driver = this.driverRepository.create(createDriverDto);
    return this.driverRepository.save(driver);
  }

  findAll() {
    return this.driverRepository.find();
  }

  findOne(id: string) {
    return this.driverRepository.findOne({ where: { id } });
  }

  update(id: string, updateDriverDto: UpdateDriverDto) {
    return this.driverRepository.update(id, updateDriverDto);
  }

  remove(id: string) {
    return this.driverRepository.delete(id);
  }
}
