/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { hashPassword } from 'src/helpers/utils';
import {
  FilterOperator,
  FilterSuffix,
  paginate,
  Paginated,
  PaginateQuery,
} from 'nestjs-paginate';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const exitUser = await this.userRepository.findOneBy({
      email: createUserDto.email,
    });
    if (exitUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await hashPassword(createUserDto.password);
    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    switch (newUser.gender) {
      case 'male':
        newUser.avatar =
          'https://cdn.pixabay.com/photo/2016/03/31/19/10/avatar-1294776_1280.png';
        break;
      case 'female':
        newUser.avatar =
          'https://icons.veryicon.com/png/o/miscellaneous/user-avatar/user-avatar-female-9.png';
        break;
    }
    await this.userRepository.save(newUser);
    return {
      id: newUser.id,
      message: 'User created successfully',
      status: HttpStatus.CREATED,
    };
  }

  findAll(query: PaginateQuery): Promise<Paginated<User>> {
    return paginate(query, this.userRepository, {
      sortableColumns: [
        'id',
        'first_name',
        'last_name',
        'email',
        'date_of_birth',
        'gender',
      ],
      nullSort: 'last',
      defaultSortBy: [['id', 'DESC']],
      searchableColumns: [
        'first_name',
        'last_name',
        'email',
        'gender',
        'address',
        'phone_number',
      ],
      filterableColumns: {
        name: [FilterOperator.EQ, FilterSuffix.NOT],
        age: true,
      },
    });
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const exitEmail = await this.userRepository.findOneBy({
      email: updateUserDto.email,
    });
    if (exitEmail) {
      throw new BadRequestException('User already exists');
    }
    await this.userRepository.update(id, updateUserDto);
    return {
      id: user.id,
      message: 'User updated successfully',
      status: HttpStatus.OK,
    };
  }

  async remove(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    await this.userRepository.update(user.id, {
      is_deleted: true,
      delete_at: new Date(),
    });
    await this.userRepository.softDelete(user.id);
    return {
      id: user.id,
      message: 'User deleted successfully',
      status: HttpStatus.OK,
    };
  }
  async restoreUserSoft(id: string) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
      withDeleted: true,
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    await this.userRepository.restore(user.id);
    await this.userRepository.update(id, {
      is_deleted: false,
      delete_at: null,
    });
    return {
      id: user.id,
      message: 'User restored successfully',
      status: HttpStatus.OK,
    };
  }
}
