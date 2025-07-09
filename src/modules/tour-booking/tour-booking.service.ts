import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTourBookingDto } from './dto/create-tour-booking.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TourBooking } from './entities/tour-booking.entity';
import { Repository } from 'typeorm';
import { Tour } from '../tour/entities/tour.entity';
import { IUser } from '../users/users.interface';
import * as dayjs from 'dayjs';

@Injectable()
export class TourBookingService {
  constructor(
    @InjectRepository(TourBooking)
    private tourBookingRepository: Repository<TourBooking>,
    @InjectRepository(Tour)
    private tourRepository: Repository<Tour>,
  ) {}
  async create(createTourBookingDto: CreateTourBookingDto, user: IUser) {
    const tour = await this.tourRepository.findOneBy({
      id: createTourBookingDto.tour_id,
    });
    if (!tour) {
      throw new BadRequestException(
        `Tour with id ${createTourBookingDto.tour_id} not found`,
      );
    }
    const totalPeople =
      createTourBookingDto.quantityAdult + createTourBookingDto.quantityChild;
    const dateOfTour = tour.durationDays;
    const startDate = dayjs(createTourBookingDto.startDate);
    const endDate = startDate.add(dateOfTour, 'days');
    if (tour.availableSlots < totalPeople || totalPeople <= 0) {
      throw new BadRequestException(
        'Total people must be greater than 0 and less than available slots',
      );
    }
    const totalPrice =
      tour.priceAdult * createTourBookingDto.quantityAdult +
      tour.priceChild * createTourBookingDto.quantityChild;
    const tourBooking = this.tourBookingRepository.create({
      ...createTourBookingDto,
      booking_by: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
      },
      tour_id: { id: tour.id },
      startDate: startDate.toDate(),
      endDate: endDate.toDate(),
      totalPrice: totalPrice,
    });
    await this.tourBookingRepository.save(tourBooking);
    return {
      id: tourBooking.id,
      message: 'Booking tour successfully',
    };
  }

  findAll() {
    return `This action returns all tourBooking`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tourBooking`;
  }

  remove(id: number) {
    return `This action removes a #${id} tourBooking`;
  }
}
