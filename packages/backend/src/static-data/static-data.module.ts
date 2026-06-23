import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaticData } from './entities/static-data.entity';
import { StaticDataController } from './static-data.controller';
import { StaticDataService } from './static-data.service';

@Module({
  imports: [TypeOrmModule.forFeature([StaticData])],
  controllers: [StaticDataController],
  providers: [StaticDataService],
  exports: [StaticDataService],
})
export class StaticDataModule {}
