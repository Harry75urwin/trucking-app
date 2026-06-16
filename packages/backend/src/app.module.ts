import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DispatchModule } from './dispatch/dispatch.module';
import { DriverModule } from './driver/driver.module';
import { LoadModule } from './load/load.module';
import { OrganizationModule } from './organization/organization.module';
import { TrackingModule } from './tracking/tracking.module';
import { UserModule } from './user/user.module';
import { VehicleModule } from './vehicle/vehicle.module';
import { CustomerModule } from './customer/customer.module';
import { LoadAssignmentModule } from './load-assignment/load-assignment.module';
import { LoadTemplate } from './load-template/entities/load-template.entity';
import { LoadTemplateModule } from './load-template/load-template.module';
import { Conversation } from './messaging/entities/conversation.entity';
import { Message } from './messaging/entities/message.entity';
import { MessagingModule } from './messaging/messaging.module';
import { User } from './user/entities/user.entity';
import { Customer } from './customer/entities/customer.entity';
import { Driver } from './driver/entities/driver.entity';
import { Vehicle } from './vehicle/entities/vehicle.entity';
import { Load } from './load/entities/load.entity';
import { Dispatch } from './dispatch/entities/dispatch.entity';
import { TrackingEvent } from './tracking/entities/tracking-event.entity';
import { LoadAssignment } from './load-assignment/entities/load-assignment.entity';
import { UploadModule } from './upload/upload.module';
import { Organization } from './organization/entities/organization.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'truckuser'),
        password: configService.get<string>('DB_PASSWORD', 'truckpass'),
        database: configService.get<string>('DB_DATABASE', 'truckapp'),
        entities: [
          User,
          Customer,
          Driver,
          Vehicle,
          Load,
          Dispatch,
          TrackingEvent,
          LoadAssignment,
          LoadTemplate,
          Conversation,
          Message,
          Organization,
        ],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    OrganizationModule,
    UserModule,
    CustomerModule,
    DriverModule,
    VehicleModule,
    LoadModule,
    DispatchModule,
    LoadAssignmentModule,
    LoadTemplateModule,
    UploadModule,
    MessagingModule,
    TrackingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
