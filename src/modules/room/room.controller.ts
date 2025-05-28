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
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { User } from 'src/decorator/customize';
import { IUser } from '../users/users.interface';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { Room } from './entities/room.entity';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('images', 10))
  create(
    @Body() createRoomDto: CreateRoomDto,
    @User() user: IUser,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.roomService.create(createRoomDto, user, files);
  }

  @Get()
  findAll(@Paginate() query: PaginateQuery): Promise<Paginated<Room>> {
    return this.roomService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('images', 10))
  update(
    @Param('id') id: string,
    @Body() updateRoomDto: UpdateRoomDto,
    @User() user: IUser,
    @UploadedFiles() newFiles: Express.Multer.File[],
    @Body('image_remove') imageRemove: string,
  ) {
    const imagesToRemove = JSON.parse(imageRemove || '[]');
    return this.roomService.update(
      id,
      updateRoomDto,
      user,
      imagesToRemove,
      newFiles,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.roomService.remove(id, user);
  }
}
