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
import { TourService } from './tour.service';
import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Public, Roles, User } from 'src/decorator/customize';
import { IUser } from '../users/users.interface';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { Tour } from './entities/tour.entity';
import { userRole } from '../users/entities/user.entity';

@Controller('tour')
export class TourController {
  constructor(private readonly tourService: TourService) {}

  @Post()
  @Roles([userRole.ADMIN, userRole.ADMIN_TOUR])
  @UseInterceptors(FilesInterceptor('images', 10))
  create(
    @Body() createTourDto: CreateTourDto,
    @User() user: IUser,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.tourService.create(createTourDto, user, files);
  }

  @Public()
  @Get()
  findAll(@Paginate() query: PaginateQuery): Promise<Paginated<Tour>> {
    return this.tourService.findAll(query);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tourService.findOne(id);
  }

  @Patch(':id')
  @Roles([userRole.ADMIN, userRole.ADMIN_TOUR])
  @UseInterceptors(FilesInterceptor('images', 10))
  update(
    @Param('id') id: string,
    @Body() updateTourDto: UpdateTourDto,
    @Body('image_remove') imageRemove: string,
    @UploadedFiles() newFiles: Express.Multer.File[],
    @User() user: IUser,
  ) {
    const imagesToRemove = JSON.parse(imageRemove || '[]');
    return this.tourService.update(
      id,
      updateTourDto,
      user,
      imagesToRemove,
      newFiles,
    );
  }

  @Delete(':id')
  @Roles([userRole.ADMIN, userRole.ADMIN_TOUR])
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.tourService.remove(id, user);
  }
}
