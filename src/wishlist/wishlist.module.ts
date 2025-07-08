import { Module } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { WishlistController } from './wishlist.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { Tour } from 'src/modules/tour/entities/tour.entity';
import { Hotel } from 'src/modules/hotel/entities/hotel.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wishlist, Tour, Hotel])],
  controllers: [WishlistController],
  providers: [WishlistService],
})
export class WishlistModule {}
