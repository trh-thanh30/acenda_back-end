import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { HotelModule } from '../hotel/hotel.module';

@Module({
  imports: [TypeOrmModule.forFeature([Room]), CloudinaryModule, HotelModule],
  controllers: [RoomController],
  providers: [RoomService],
})
export class RoomModule {}
