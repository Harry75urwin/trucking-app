import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoadTemplateController } from './load-template.controller';
import { LoadTemplateService } from './load-template.service';
import { LoadTemplate } from './entities/load-template.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LoadTemplate])],
  controllers: [LoadTemplateController],
  providers: [LoadTemplateService],
})
export class LoadTemplateModule {}
