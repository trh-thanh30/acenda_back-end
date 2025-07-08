import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { Tour } from 'src/modules/tour/entities/tour.entity';
import { IUser } from 'src/modules/users/users.interface';
import { Hotel } from 'src/modules/hotel/entities/hotel.entity';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    @InjectRepository(Tour)
    private tourRepository: Repository<Tour>,
    @InjectRepository(Hotel)
    private hotelRepository: Repository<Hotel>,
  ) {}
  async toggleWishlist(tourId: string, hotelId: string, user: IUser) {
    if (tourId) {
      const tour = await this.tourRepository.findOne({ where: { id: tourId } });
      if (!tour) {
        throw new BadRequestException(`Not found tour id: ${tourId}`);
      } else {
        const hasWishlist = await this.wishlistRepository.findOneBy({
          user: { id: user.id },
          tour: { id: tourId },
        });
        // have add wishlist on db
        if (hasWishlist) {
          await this.wishlistRepository.remove(hasWishlist);
          return {
            message: 'Tour removed from wishlist successfully',
            status: 204,
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
            status: 201,
          };
        }
      }
    }
    if (hotelId) {
      const hotel = await this.hotelRepository.findOne({
        where: { id: hotelId },
      });
      if (!hotel) {
        throw new BadRequestException(`Not found hotel id: ${hotelId}`);
      } else {
        const hasWishlist = await this.wishlistRepository.findOneBy({
          user: { id: user.id },
          hotel: { id: hotelId },
        });
        if (hasWishlist) {
          await this.wishlistRepository.remove(hasWishlist);
          return {
            message: 'Hotel removed from wishlist successfully',
            status: 204,
          };
        } else {
          const newWishlist = this.wishlistRepository.create({
            user: { id: user.id },
            hotel: { id: hotel.id },
          });
          await this.wishlistRepository.save(newWishlist);
          return {
            message: 'Hotel added to wishlist successfully',
            status: 201,
          };
        }
      }
    }
  }
  getWishlist(user: IUser, orderBy: string) {
    if (orderBy === 'hotel') {
      return this.wishlistRepository.find({
        where: { user: { id: user.id } },
        relations: ['hotel', 'hotel.address'],
      });
    } else if (orderBy === 'tour') {
      return this.wishlistRepository.find({
        where: { user: { id: user.id } },
        relations: ['tour'],
      });
    } else {
      return this.wishlistRepository.find({
        where: { user: { id: user.id } },
        relations: ['tour', 'hotel', 'hotel.address'],
      });
    }
  }
  async removeAllWishlist(user: IUser) {
    await this.wishlistRepository.delete({ user: { id: user.id } });
    return {
      message: 'All wishlist removed successfully',
      status: HttpStatus.OK,
    };
  }
}
