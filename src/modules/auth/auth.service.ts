import { HttpStatus, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from '../users/users.service';
import { CodeDto } from './dto/code.dto';
import { comparePassword } from 'src/helpers/utils';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { IUser } from '../users/users.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    const isValidPassword = await comparePassword(pass, user.password);
    if (!user || !isValidPassword) return null;
    return user;
  }
  async register(registerDto: RegisterDto) {
    return await this.userService.register(registerDto);
  }
  async activeAccount(code: CodeDto) {
    return await this.userService.handleActiveAccount(code);
  }
  async resendCode(email: string) {
    return await this.userService.retryActive(email);
  }
  login(user: IUser, res: Response) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const access_token = this.jwtService.sign(payload);

    const safeUser = {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      gender: user.gender,
      role: user.role,
    };

    return {
      access_token,
      user: safeUser,
      message: 'Login successfully',
      status: HttpStatus.OK,
    };
  }
  async getProfile(user: IUser) {
    const profile = await this.userService.findOne(user.id);
    if (!profile) {
      return {
        message: 'User not found',
        status: HttpStatus.NOT_FOUND,
      };
    }
    return profile;
  }
}
