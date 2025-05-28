import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';
import { IUser } from '../users/users.interface';
import { HotelService } from '../hotel/hotel.service';
import {
  FilterOperator,
  FilterSuffix,
  paginate,
  Paginated,
  PaginateQuery,
} from 'nestjs-paginate';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    private readonly hotelService: HotelService,
  ) {}
  async create(createReviewDto: CreateReviewDto, user: IUser) {
    const hotel = await this.hotelService.findOne(createReviewDto.hotel_id);
    if (!hotel) {
      throw new BadRequestException('Hotel not found');
    }
    const newReview = this.reviewRepository.create({
      ...createReviewDto,
      hotel: hotel,
      created_by: { id: user.id, email: user.email },
    });
    await this.reviewRepository.save(newReview);
    return {
      message: 'Review created successfully',
      status: HttpStatus.CREATED,
      review: newReview,
    };
  }

  findAll(query: PaginateQuery): Promise<Paginated<Review>> {
    return paginate(query, this.reviewRepository, {
      sortableColumns: [
        'id',
        'title',
        'rating',
        'comment',
        'created_at',
        'updated_at',
      ],
      defaultSortBy: [['id', 'DESC']],
      searchableColumns: [
        'title',
        'comment',
        'rating',
        'created_at',
        'updated_at',
      ],
      relations: ['hotel'],
      filterableColumns: {
        name: [FilterOperator.EQ, FilterSuffix.NOT],
      },
    });
  }

  async findOne(id: string) {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ['hotel'],
    });
    if (!review) {
      throw new BadRequestException('Review not found');
    }
    return review;
  }

  async update(id: string, updateReviewDto: UpdateReviewDto, user: IUser) {
    const review = await this.reviewRepository.findOneBy({ id });
    if (!review) {
      throw new BadRequestException('Review not found');
    }
    await this.reviewRepository.update(review.id, {
      ...updateReviewDto,
      updated_by: { id: user.id, email: user.email },
    });
    return {
      message: 'Review updated successfully',
      status: HttpStatus.OK,
    };
  }

  async remove(id: string, user: IUser) {
    const review = await this.reviewRepository.findOneBy({ id });
    if (!review) {
      throw new BadRequestException('Review not found');
    }
    await this.reviewRepository.update(review.id, {
      is_deleted: true,
      deleted_by: { id: user.id, email: user.email },
    });
    await this.reviewRepository.softDelete(review.id);
    return {
      message: 'Review deleted successfully',
      status: HttpStatus.OK,
    };
  }
}
