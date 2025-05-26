import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Hotel } from './entities/hotel.entity';
import { Repository } from 'typeorm';
import { IUser } from '../users/users.interface';
import { AddressService } from '../address/address.service';

@Injectable()
export class HotelService {
  constructor(
    @InjectRepository(Hotel)
    private readonly hotelRepository: Repository<Hotel>,
    private readonly addressService: AddressService,
  ) {}
  async create(createHotelDto: CreateHotelDto, user: IUser) {
    const { address: addressDto, ...hotelData } = createHotelDto;
    const exitingHotel = await this.hotelRepository.findOne({
      where: { name: createHotelDto.name },
    });
    if (exitingHotel) {
      throw new BadRequestException(`Hotel already exists`);
    }
    const address = await this.addressService.create(addressDto, user);
    const hotel = this.hotelRepository.create({
      ...hotelData,
      address,
      created_by: { id: user.id, email: user.email },
    });
    const savedHotel = await this.hotelRepository.save(hotel);
    address.hotel = hotel;
    await this.addressService.updateHotelInAddress(address.id, savedHotel);
    return savedHotel;
  }

  findAll() {
    return `This action returns all hotel`;
  }

  findOne(id: number) {
    return `This action returns a #${id} hotel`;
  }

  update(id: number, updateHotelDto: UpdateHotelDto) {
    return `This action updates a #${id} hotel`;
  }

  remove(id: number) {
    return `This action removes a #${id} hotel`;
  }
}
