import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoadAssignmentController } from './load-assignment.controller';
import { LoadAssignmentService } from './load-assignment.service';
import { LoadAssignment } from './entities/load-assignment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LoadAssignment])],
  controllers: [LoadAssignmentController],
  providers: [LoadAssignmentService],
})
export class LoadAssignmentModule {}
