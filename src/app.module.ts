import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { DatabaseConfig } from './config/database.config';
import { MailerConfig } from './config/mailer.config';
import { AuthModule } from './modules/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './shared/guards/jwt-auth.guard';
import { UploadModule } from './modules/upload/upload.module';
import { HotelModule } from './modules/hotel/hotel.module';
import { AddressModule } from './modules/address/address.module';
import { RoomModule } from './modules/room/room.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseConfig,
    MailerConfig,
    UsersModule,
    AuthModule,
    UploadModule,
    HotelModule,
    AddressModule,
    RoomModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, // Global guard for JWT authentication
    },
  ],
})
export class AppModule {}
