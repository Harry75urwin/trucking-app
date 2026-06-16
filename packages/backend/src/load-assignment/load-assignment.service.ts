import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { CreateLoadAssignmentDto } from './dto/create-load-assignment.dto';
import { UpdateLoadAssignmentDto } from './dto/update-load-assignment.dto';
import { LoadAssignment } from './entities/load-assignment.entity';
import { DEMO_LOAD_ASSIGNMENTS } from '../demo/demo-data';

@Injectable()
export class LoadAssignmentService implements OnModuleInit {
  constructor(
    @InjectRepository(LoadAssignment)
    private loadAssignmentRepository: Repository<LoadAssignment>,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    if (this.isDemoDataEnabled()) {
      const count = await this.loadAssignmentRepository.count();
      if (count === 0) {
        await this.loadAssignmentRepository.save(DEMO_LOAD_ASSIGNMENTS);
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

  create(createLoadAssignmentDto: CreateLoadAssignmentDto) {
    const assignment = this.loadAssignmentRepository.create(
      createLoadAssignmentDto,
    );
    return this.loadAssignmentRepository.save(assignment);
  }

  findAll() {
    return this.loadAssignmentRepository.find();
  }

  findOne(id: string) {
    return this.loadAssignmentRepository.findOne({ where: { id } });
  }

  update(id: string, updateLoadAssignmentDto: UpdateLoadAssignmentDto) {
    return this.loadAssignmentRepository.update(id, updateLoadAssignmentDto);
  }

  remove(id: string) {
    return this.loadAssignmentRepository.delete(id);
  }
}
