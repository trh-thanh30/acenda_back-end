import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { Tour } from 'src/modules/tour/entities/tour.entity';
import { IUser } from 'src/modules/users/users.interface';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    @InjectRepository(Tour)
    private tourRepository: Repository<Tour>,
  ) {}
  async toggleWishlist(tourId: string, user: IUser) {
    const tour = await this.tourRepository.findOne({ where: { id: tourId } });
    if (!tour) {
      throw new BadRequestException(`Tour with id ${tourId} not found`);
    }
    const hasWishlist = await this.wishlistRepository.findOneBy({
      user: { id: user.id },
      tour: { id: tourId },
    });
    // have add wishlist on db
    if (hasWishlist) {
      await this.wishlistRepository.remove(hasWishlist);
      return {
        message: 'Tour removed from wishlist successfully',
        status: HttpStatus.OK,
      };
      // have not add wishlist on db
    } else {
      const newWishlist = this.wishlistRepository.create({
        user: { id: user.id },
        tour: { id: tour.id },
      });
      await this.wishlistRepository.save(newWishlist);
      return {
        message: 'Tour added to wishlist successfully',
        status: HttpStatus.OK,
      };
    }
  }
  getWishlist(user: IUser) {
    return this.wishlistRepository.find({
      where: { user: { id: user.id } },
      relations: ['tour'],
    });
  }
  async removeAllWishlist(user: IUser) {
    await this.wishlistRepository.delete({ user: { id: user.id } });
    return {
      message: 'All wishlist removed successfully',
      status: HttpStatus.OK,
    };
  }
}
