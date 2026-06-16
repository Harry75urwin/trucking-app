import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { CreateLoadDto } from './dto/create-load.dto';
import { UpdateLoadDto } from './dto/update-load.dto';
import { Load } from './entities/load.entity';
import { DEMO_LOADS } from '../demo/demo-data';

@Injectable()
export class LoadService implements OnModuleInit {
  constructor(
    @InjectRepository(Load)
    private loadRepository: Repository<Load>,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    if (this.isDemoDataEnabled()) {
      const count = await this.loadRepository.count();
      if (count === 0) {
        await this.loadRepository.save(DEMO_LOADS);
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

  create(createLoadDto: CreateLoadDto) {
    const load = this.loadRepository.create(createLoadDto);
    return this.loadRepository.save(load);
  }

  findAll() {
    return this.loadRepository.find();
  }

  findOne(id: string) {
    return this.loadRepository.findOne({ where: { id } });
  }

  async update(id: string, updateLoadDto: UpdateLoadDto) {
    await this.loadRepository.update(id, updateLoadDto);
    return this.loadRepository.findOne({ where: { id } });
  }

  remove(id: string) {
    return this.loadRepository.delete(id);
  }
}
