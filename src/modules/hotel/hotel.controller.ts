import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { HotelService } from './hotel.service';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { Public, Roles, User } from 'src/decorator/customize';
import { IUser } from '../users/users.interface';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { Hotel } from './entities/hotel.entity';
import { FilesInterceptor } from '@nestjs/platform-express';
import { userRole } from '../users/entities/user.entity';

@Controller('hotel')
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}

  @Post()
  @Roles([userRole.ADMIN, userRole.ADMIN_HOTEL])
  @UseInterceptors(FilesInterceptor('images', 10)) // max img count is 10
  async create(
    @Body() createHotelDto: CreateHotelDto,
    @User() user: IUser,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.hotelService.create(createHotelDto, user, files);
  }

  @Public()
  @Get()
  findAll(@Paginate() query: PaginateQuery): Promise<Paginated<Hotel>> {
    return this.hotelService.findAll(query);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.hotelService.findOne(id);
  }

  @Patch(':id')
  @Roles([userRole.ADMIN, userRole.ADMIN_HOTEL])
  @UseInterceptors(FilesInterceptor('images', 10)) // max img count is 10
  update(
    @Param('id') id: string,
    @Body() updateHotelDto: UpdateHotelDto,
    @Body('image_remove') imageRemove: string,
    @UploadedFiles() newFiles: Express.Multer.File[],
    @User() user: IUser,
  ) {
    const imagesToRemove = JSON.parse(imageRemove || '[]');
    return this.hotelService.update(
      id,
      updateHotelDto,
      user,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      imagesToRemove,
      newFiles,
    );
  }

  @Delete(':id')
  @Roles([userRole.ADMIN, userRole.ADMIN_HOTEL])
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.hotelService.remove(id, user);
  }

  @Patch('restore/:id')
  @Roles([userRole.ADMIN, userRole.ADMIN_HOTEL])
  restore(@Param('id') id: string) {
    return this.hotelService.restoreHotelSoft(id);
  }
}
