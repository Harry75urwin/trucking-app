import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { Organization } from './entities/organization.entity';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
  ) {}

  create(createOrganizationDto: CreateOrganizationDto) {
    const organization = this.organizationRepository.create(
      createOrganizationDto,
    );
    return this.organizationRepository.save(organization);
  }

  findAll() {
    return this.organizationRepository.find();
  }

  findOne(id: number) {
    return this.organizationRepository.findOne({ where: { id } });
  }

  async update(id: number, updateOrganizationDto: UpdateOrganizationDto) {
    await this.organizationRepository.update(id, updateOrganizationDto);
    return this.organizationRepository.findOne({ where: { id } });
  }

  remove(id: number) {
    return this.organizationRepository.delete(id);
  }
}
