import { Module } from '@nestjs/common';
import { TourBookingService } from './tour-booking.service';
import { TourBookingController } from './tour-booking.controller';

@Module({
  controllers: [TourBookingController],
  providers: [TourBookingService],
})
export class TourBookingModule {}
