import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLoadTemplateDto } from './dto/create-load-template.dto';
import { UpdateLoadTemplateDto } from './dto/update-load-template.dto';
import { LoadTemplate } from './entities/load-template.entity';
import { DEMO_LOAD_TEMPLATES } from '../demo/demo-data';

@Injectable()
export class LoadTemplateService implements OnModuleInit {
  constructor(
    @InjectRepository(LoadTemplate)
    private loadTemplateRepository: Repository<LoadTemplate>,
  ) {}

  async onModuleInit() {
    const count = await this.loadTemplateRepository.count();
    if (count === 0) {
      await this.loadTemplateRepository.save(DEMO_LOAD_TEMPLATES);
    }
  }

  create(createLoadTemplateDto: CreateLoadTemplateDto) {
    const template = this.loadTemplateRepository.create(createLoadTemplateDto);
    return this.loadTemplateRepository.save(template);
  }

  findAll(organizationId?: string) {
    const where = organizationId ? { organization_id: organizationId } : {};
    return this.loadTemplateRepository.find({ where });
  }

  findOne(id: string) {
    return this.loadTemplateRepository.findOne({ where: { id } });
  }

  update(id: string, updateLoadTemplateDto: UpdateLoadTemplateDto) {
    return this.loadTemplateRepository.update(id, updateLoadTemplateDto);
  }

  remove(id: string) {
    return this.loadTemplateRepository.delete(id);
  }
}
