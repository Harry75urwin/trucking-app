import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { CreateDispatchDto } from './dto/create-dispatch.dto';
import { UpdateDispatchDto } from './dto/update-dispatch.dto';
import { Dispatch } from './entities/dispatch.entity';
import { DEMO_DISPATCHES } from '../demo/demo-data';

@Injectable()
export class DispatchService implements OnModuleInit {
  constructor(
    @InjectRepository(Dispatch)
    private dispatchRepository: Repository<Dispatch>,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    if (this.isDemoDataEnabled()) {
      const count = await this.dispatchRepository.count();
      if (count === 0) {
        await this.dispatchRepository.save(DEMO_DISPATCHES);
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

  create(createDispatchDto: CreateDispatchDto) {
    const dispatch = this.dispatchRepository.create(createDispatchDto);
    return this.dispatchRepository.save(dispatch);
  }

  findAll() {
    return this.dispatchRepository.find();
  }

  findOne(id: string) {
    return this.dispatchRepository.findOne({ where: { id } });
  }

  update(id: string, updateDispatchDto: UpdateDispatchDto) {
    return this.dispatchRepository.update(id, updateDispatchDto);
  }

  remove(id: string) {
    return this.dispatchRepository.delete(id);
  }
}
