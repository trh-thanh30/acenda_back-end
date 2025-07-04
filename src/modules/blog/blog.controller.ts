import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { IUser } from '../users/users.interface';
import { Public, Roles, User } from 'src/decorator/customize';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { Blog } from './entities/blog.entity';
import { userRole } from '../users/entities/user.entity';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @UseInterceptors(FileInterceptor('thumbnail'))
  @Post()
  @Roles([userRole.ADMIN, userRole.ADMIN_HOTEL, userRole.ADMIN_TOUR])
  create(
    @Body() createBlogDto: CreateBlogDto,
    @UploadedFile() file: Express.Multer.File,
    @User() user: IUser,
  ) {
    return this.blogService.create(createBlogDto, file, user);
  }

  @Public()
  @Get()
  findAll(@Paginate() query: PaginateQuery): Promise<Paginated<Blog>> {
    return this.blogService.findAll(query);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogService.findOne(id);
  }

  @Patch(':id')
  @Roles([userRole.ADMIN, userRole.ADMIN_HOTEL, userRole.ADMIN_TOUR])
  update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogService.update(id, updateBlogDto);
  }

  @Delete(':id')
  @Roles([userRole.ADMIN, userRole.ADMIN_HOTEL, userRole.ADMIN_TOUR])
  removeSoft(@Param('id') id: string, @User() user: IUser) {
    return this.blogService.removeSoft(id, user);
  }
}
