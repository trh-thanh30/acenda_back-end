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
import { User } from 'src/decorator/customize';
import { IUser } from '../users/users.interface';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { Tour } from './entities/tour.entity';

@Controller('tour')
export class TourController {
  constructor(private readonly tourService: TourService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('images', 10))
  create(
    @Body() createTourDto: CreateTourDto,
    @User() user: IUser,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.tourService.create(createTourDto, user, files);
  }

  @Get()
  findAll(@Paginate() query: PaginateQuery): Promise<Paginated<Tour>> {
    return this.tourService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tourService.findOne(id);
  }

  @Patch(':id')
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
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.tourService.remove(id, user);
  }
}
