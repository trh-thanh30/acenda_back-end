import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import {
  PaginateQuery,
  paginate,
  Paginated,
  FilterOperator,
  FilterSuffix,
} from 'nestjs-paginate';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterDto } from '../auth/dto/register.dto';
import { ChangePasswordDto, CodeDto } from '../auth/dto/code.dto';
import { User, userStatus } from './entities/user.entity';
import { hashPassword } from 'src/helpers/utils';
import * as dayjs from 'dayjs';
import { nanoid } from 'nanoid';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly mailerService: MailerService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOneBy({
      email: createUserDto.email,
    });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await hashPassword(createUserDto.password);
    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      avatar: this.setDefaultAvatar(createUserDto.gender),
    });

    await this.userRepository.save(newUser);
    return this.buildResponse(
      newUser.id,
      'User created successfully',
      HttpStatus.CREATED,
    );
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
    if (!user) throw new BadRequestException('User not found');
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new BadRequestException('User not found');

    const existingEmail = await this.userRepository.findOneBy({
      email: updateUserDto.email,
    });
    if (existingEmail && existingEmail.id !== id) {
      throw new BadRequestException('Email already exists');
    }

    await this.userRepository.update(id, updateUserDto);
    return this.buildResponse(id, 'User updated successfully');
  }

  async remove(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new BadRequestException('User not found');

    await this.userRepository.update(user.id, {
      is_deleted: true,
      delete_at: new Date(),
    });
    await this.userRepository.softDelete(user.id);
    return this.buildResponse(user.id, 'User deleted successfully');
  }

  async restoreUserSoft(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      withDeleted: true,
    });
    if (!user) throw new BadRequestException('User not found');

    await this.userRepository.restore(id);
    await this.userRepository.update(id, {
      is_deleted: false,
      delete_at: null,
    });
    return this.buildResponse(user.id, 'User restored successfully');
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.userRepository.findOneBy({
      email: registerDto.email,
    });
    if (existingUser) throw new BadRequestException('User already exists');

    const hashedPassword = await hashPassword(registerDto.password);
    const { code, expiredAt } = this.generateActivationCode();

    const newUser = this.userRepository.create({
      ...registerDto,
      password: hashedPassword,
      avatar: this.setDefaultAvatar(registerDto.gender),
      code_id: code,
      code_expired: expiredAt,
    });

    await this.userRepository.save(newUser);
    await this.sendActivationMail(
      newUser.email,
      newUser.email,
      code,
      'Active your account',
      'register',
    );
    return this.buildResponse(
      newUser.id,
      'Register successfully',
      HttpStatus.CREATED,
    );
  }

  async handleActiveAccount(code: CodeDto) {
    const user = await this.userRepository.findOneBy({
      code_id: code.code,
      id: code.id,
    });
    if (!user) throw new BadRequestException('User not found');

    if (!dayjs().isBefore(user.code_expired)) {
      throw new BadRequestException('Code is expired. Please try again!!');
    }
    if (user.code_id !== code.code) {
      throw new BadRequestException('Code is not valid. Please try again!!');
    }
    await this.userRepository.update(user.id, {
      is_active: true,
      user_status: userStatus.ACTIVE,
    });

    return this.buildResponse(user.id, 'Active account successfully');
  }

  async retryActive(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) throw new BadRequestException('User not found');
    if (user.is_active) throw new BadRequestException('User already active');

    const { code, expiredAt } = this.generateActivationCode();
    await this.userRepository.update(user.id, {
      code_id: code,
      code_expired: expiredAt,
    });

    await this.sendActivationMail(
      user.email,
      user.email,
      code,
      'Reactive your account',
      'register',
    );
    return this.buildResponse(user.id, 'Resend code successfully');
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) throw new BadRequestException('User not found');
    return user;
  }
  async retryPassword(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) throw new BadRequestException('User not found');
    const { code, expiredAt } = this.generateActivationCode();
    await this.userRepository.update(user.id, {
      code_id: code,
      code_expired: expiredAt,
    });
    await this.sendActivationMail(
      user.email,
      user.email,
      code,
      'Change your password account at Acenda',
      'changePassword',
    );
    return this.buildResponse(
      user.id,
      'Send code to change password successfully',
    );
  }
  async changePassword(changePasswordDto: ChangePasswordDto) {
    if (changePasswordDto.password !== changePasswordDto.confirmPassword) {
      throw new BadRequestException(
        'Password and confirm password do not match',
      );
    }
    const user = await this.userRepository.findOneBy({
      id: changePasswordDto.id,
    });
    if (!user) throw new BadRequestException('User not found');
    const isBeforeChecked = dayjs().isBefore(user?.code_expired);
    if (!isBeforeChecked) {
      throw new BadRequestException('Code is expired. Please try again!!');
    }
    if (user?.code_id !== changePasswordDto.code) {
      throw new BadRequestException('Code is not valid. Please try again!!');
    }
    const hashedPassword = await hashPassword(changePasswordDto.password);
    await this.userRepository.update(user.id, {
      password: hashedPassword,
    });
    return this.buildResponse(
      user.id,
      'Change password successfully',
      HttpStatus.CREATED,
    );
  }
  // ---------- PRIVATE HELPERS ----------

  async updateUserToken(id: string, refreshToken: string) {
    return await this.userRepository.update(id, {
      refresh_token: refreshToken,
    });
  }
  async findUserByToken(refreshToken: string) {
    return await this.userRepository.findOne({
      where: {
        refresh_token: refreshToken,
      },
    });
  }
  private setDefaultAvatar(gender: string): string {
    switch (gender) {
      case 'male':
        return 'https://cdn.pixabay.com/photo/2016/03/31/19/10/avatar-1294776_1280.png';
      case 'female':
        return 'https://icons.veryicon.com/png/o/miscellaneous/user-avatar/user-avatar-female-9.png';
      default:
        return '';
    }
  }

  private generateActivationCode(): { code: string; expiredAt: Date } {
    return {
      code: nanoid(6),
      expiredAt: dayjs().add(5, 'minute').toDate(),
    };
  }

  private async sendActivationMail(
    email: string,
    name: string,
    code: string,
    subject: string,
    template: string,
  ) {
    await this.mailerService.sendMail({
      to: email,
      subject,
      template: template,
      context: { name, activationCode: code },
    });
  }

  private buildResponse(id: string, message: string, status = HttpStatus.OK) {
    return { id, message, status };
  }
}
