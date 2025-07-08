import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { User } from 'src/decorator/customize';
import { IUser } from 'src/modules/users/users.interface';

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}
  @Post()
  toggleWishlist(
    @Body('tourId') tourId: string,
    @Body('hotelId') hotelId: string,
    @User() user: IUser,
  ) {
    return this.wishlistService.toggleWishlist(tourId, hotelId, user);
  }

  @Get()
  getWishlist(@Query('orderBy') orderBy: string, @User() user: IUser) {
    return this.wishlistService.getWishlist(user, orderBy);
  }
  @Post('remove-all')
  removeAllWishlist(@User() user: IUser) {
    return this.wishlistService.removeAllWishlist(user);
  }
}
