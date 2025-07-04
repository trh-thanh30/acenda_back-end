import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TourBookingService } from './tour-booking.service';
import { CreateTourBookingDto } from './dto/create-tour-booking.dto';
import { UpdateTourBookingDto } from './dto/update-tour-booking.dto';

@Controller('tour-booking')
export class TourBookingController {
  constructor(private readonly tourBookingService: TourBookingService) {}

  @Post()
  create(@Body() createTourBookingDto: CreateTourBookingDto) {
    return this.tourBookingService.create(createTourBookingDto);
  }

  @Get()
  findAll() {
    return this.tourBookingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tourBookingService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTourBookingDto: UpdateTourBookingDto,
  ) {
    return this.tourBookingService.update(+id, updateTourBookingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tourBookingService.remove(+id);
  }
}
