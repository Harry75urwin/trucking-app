import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from '../user/entities/user.entity';
import { Organization } from '../organization/entities/organization.entity';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([User, Organization])],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard],
  exports: [JwtAuthGuard],
})
export class AuthModule {}
