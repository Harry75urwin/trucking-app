import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoadController } from './load.controller';
import { LoadService } from './load.service';
import { Load } from './entities/load.entity';
import { Customer } from '../customer/entities/customer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Load, Customer])],
  controllers: [LoadController],
  providers: [LoadService],
})
export class LoadModule {}
