import { Module } from '@nestjs/common';
import { TourBookingService } from './tour-booking.service';
import { TourBookingController } from './tour-booking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TourBooking } from './entities/tour-booking.entity';
import { Tour } from '../tour/entities/tour.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TourBooking, Tour])],
  controllers: [TourBookingController],
  providers: [TourBookingService],
})
export class TourBookingModule {}
