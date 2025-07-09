import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { TourBookingService } from './tour-booking.service';
import { CreateTourBookingDto } from './dto/create-tour-booking.dto';
// import { UpdateTourBookingDto } from './dto/update-tour-booking.dto';
import { User } from 'src/decorator/customize';
import { IUser } from '../users/users.interface';

@Controller('tour-booking')
export class TourBookingController {
  constructor(private readonly tourBookingService: TourBookingService) {}

  @Post()
  create(
    @Body() createTourBookingDto: CreateTourBookingDto,
    @User() user: IUser,
  ) {
    return this.tourBookingService.create(createTourBookingDto, user);
  }

  @Get()
  findAll() {
    return this.tourBookingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tourBookingService.findOne(+id);
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateTourBookingDto: UpdateTourBookingDto,
  // ) {
  //   return this.tourBookingService.update(+id, updateTourBookingDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tourBookingService.remove(+id);
  }
}
