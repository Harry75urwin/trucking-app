import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';
import { DEMO_CUSTOMERS } from '../demo/demo-data';

@Injectable()
export class CustomerService implements OnModuleInit {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    if (this.isDemoDataEnabled()) {
      const count = await this.customerRepository.count();
      if (count === 0) {
        await this.customerRepository.save(DEMO_CUSTOMERS);
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

  create(createCustomerDto: CreateCustomerDto) {
    const customer = this.customerRepository.create(createCustomerDto);
    return this.customerRepository.save(customer);
  }

  findAll(name?: string) {
    if (name) {
      return this.customerRepository
        .createQueryBuilder('customer')
        .where('LOWER(customer.name) LIKE LOWER(:name)', { name: `%${name}%` })
        .getMany();
    }
    return this.customerRepository.find();
  }

  findOne(id: string) {
    return this.customerRepository.findOne({ where: { id } });
  }

  update(id: string, updateCustomerDto: UpdateCustomerDto) {
    return this.customerRepository.update(id, updateCustomerDto);
  }

  remove(id: string) {
    return this.customerRepository.delete(id);
  }
}
