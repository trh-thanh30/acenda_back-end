import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Public, Roles, User } from 'src/decorator/customize';
import { IUser } from '../users/users.interface';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { Address } from './entities/address.entity';
import { userRole } from '../users/entities/user.entity';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  @Roles([userRole.ADMIN, userRole.ADMIN_HOTEL])
  create(@Body() createAddressDto: CreateAddressDto, @User() user: IUser) {
    return this.addressService.create(createAddressDto, user);
  }

  @Public()
  @Get()
  findAll(@Paginate() query: PaginateQuery): Promise<Paginated<Address>> {
    return this.addressService.findAll(query);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.addressService.findOne(id);
  }

  @Patch(':id')
  @Roles([userRole.ADMIN, userRole.ADMIN_HOTEL])
  update(
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDto,
    @User() user: IUser,
  ) {
    return this.addressService.update(id, updateAddressDto, user);
  }

  @Delete(':id')
  @Roles([userRole.ADMIN, userRole.ADMIN_HOTEL])
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.addressService.remove(id, user);
  }
}
