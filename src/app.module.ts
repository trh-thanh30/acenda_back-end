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
import { ReviewModule } from './modules/review/review.module';
import { BookingModule } from './modules/booking/booking.module';
import { TourModule } from './modules/tour/tour.module';
import { TourBookingModule } from './modules/tour-booking/tour-booking.module';
import { DifyChatModule } from './modules/dify-chat/dify-chat.module';
import { BlogModule } from './modules/blog/blog.module';
import { RolesGuard } from './shared/guards/roles.guard';
import { WishlistModule } from './wishlist/wishlist.module';

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
    ReviewModule,
    BookingModule,
    TourModule,
    TourBookingModule,
    DifyChatModule,
    BlogModule,
    WishlistModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, // Global guard for JWT authentication
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard, // Global guard for role-based authorization
    },
  ],
})
export class AppModule {}
