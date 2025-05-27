import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { Repository } from 'typeorm';
import { IUser } from '../users/users.interface';
import { Hotel } from '../hotel/entities/hotel.entity';
import {
  FilterOperator,
  FilterSuffix,
  paginate,
  Paginated,
  PaginateQuery,
} from 'nestjs-paginate';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}
  async create(createAddressDto: CreateAddressDto, user: IUser) {
    const newAddress = this.addressRepository.create({
      ...createAddressDto,
      created_by: { id: user.id, email: user.email },
    });
    return await this.addressRepository.save(newAddress);
  }

  findAll(query: PaginateQuery): Promise<Paginated<Address>> {
    return paginate(query, this.addressRepository, {
      sortableColumns: [
        'id',
        'commune',
        'district',
        'province',
        'detail_address',
        'created_at',
        'updated_at',
      ],
      defaultSortBy: [['id', 'DESC']],
      searchableColumns: [
        'commune',
        'district',
        'province',
        'detail_address',
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
    const address = await this.addressRepository.findOne({
      where: { id },
      relations: ['hotel'],
    });
    if (!address) {
      throw new BadRequestException('Address not found');
    }
    return address;
  }

  async update(id: string, updateAddressDto: UpdateAddressDto, user: IUser) {
    const address = await this.addressRepository.findOne({ where: { id } });
    if (!address) {
      throw new BadRequestException('Address not found');
    }
    await this.addressRepository.update(address.id, {
      ...updateAddressDto,
      updated_by: {
        id: user.id,
        email: user.email,
      },
    });
    const updatedAddress = await this.addressRepository.findOne({
      where: { id },
      relations: ['hotel'],
    });
    if (!updatedAddress) {
      throw new BadRequestException('Address not found after update');
    }
    return updatedAddress;
  }

  async remove(id: string, user: IUser) {
    const address = await this.addressRepository.findOneBy({ id });
    if (!address) {
      throw new BadRequestException('Address not found');
    }
    await this.addressRepository.update(address.id, {
      is_deleted: true,
      deleted_by: {
        id: user.id,
        email: user.email,
      },
    });
    await this.addressRepository.softDelete(address.id);
    return {
      message: 'Address deleted successfully',
      status: HttpStatus.OK,
    };
  }
  /** Helper function */
  async updateHotelInAddress(addressId: string, hotel: Hotel) {
    const address = await this.addressRepository.findOne({
      where: { id: addressId },
    });
    if (!address) throw new BadRequestException('Address not found');
    address.hotel = hotel;
    return this.addressRepository.save(address); // sẽ update hotel_id
  }
}
