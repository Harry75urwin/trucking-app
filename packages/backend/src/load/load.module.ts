import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoadController } from './load.controller';
import { LoadService } from './load.service';
import { Load } from './entities/load.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Load])],
  controllers: [LoadController],
  providers: [LoadService],
})
export class LoadModule {}
