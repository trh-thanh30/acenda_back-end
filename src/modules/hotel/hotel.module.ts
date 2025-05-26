import { forwardRef, Module } from '@nestjs/common';
import { HotelService } from './hotel.service';
import { HotelController } from './hotel.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hotel } from './entities/hotel.entity';
import { AddressModule } from '../address/address.module';

@Module({
  imports: [TypeOrmModule.forFeature([Hotel]), forwardRef(() => AddressModule)],
  controllers: [HotelController],
  providers: [HotelService],
})
export class HotelModule {}
