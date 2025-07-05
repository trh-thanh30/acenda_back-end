import { Body, Controller, Get, Post } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { User } from 'src/decorator/customize';
import { IUser } from 'src/modules/users/users.interface';

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}
  @Post()
  toggleWishlist(@Body('tourId') tourId: string, @User() user: IUser) {
    return this.wishlistService.toggleWishlist(tourId, user);
  }

  @Get()
  getWishlist(@User() user: IUser) {
    return this.wishlistService.getWishlist(user);
  }
  @Post('remove-all')
  removeAllWishlist(@User() user: IUser) {
    return this.wishlistService.removeAllWishlist(user);
  }
}
