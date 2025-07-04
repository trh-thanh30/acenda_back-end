import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { User, userRole } from './entities/user.entity';
import { Public, Roles } from 'src/decorator/customize';
import { Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Roles([userRole.ADMIN])
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Roles([userRole.ADMIN])
  @Get()
  findAll(@Paginate() query: PaginateQuery): Promise<Paginated<User>> {
    return this.usersService.findAll(query);
  }

  @Roles([userRole.ADMIN])
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Res({ passthrough: true }) res: Response, @Param('id') id: string) {
    return this.usersService.remove(id, res);
  }

  @Public()
  @Post('/already-email')
  alreadyEmail(@Body('email') email: string) {
    return this.usersService.alreadyEmail(email);
  }

  @Roles([userRole.ADMIN])
  @Patch('/restore/:id')
  restore(@Param('id') id: string) {
    return this.usersService.restoreUserSoft(id);
  }
}
