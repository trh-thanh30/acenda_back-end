/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from '../users/users.service';
import { ChangePasswordDto, CodeDto } from './dto/code.dto';
import { comparePassword } from 'src/helpers/utils';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { IUser } from '../users/users.interface';
import { ConfigService } from '@nestjs/config';
import { userStatus } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
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
  async login(user: IUser, res: Response) {
    const profile = await this.userService.findByEmail(user.email);
    if (
      profile.user_status === userStatus.INACTIVE &&
      profile.is_active === false
    ) {
      throw new BadRequestException('Account is not active');
    }
    const payload = {
      sub: 'token login',
      iss: 'from server',
      id: user.id,
      email: user.email,
      role: user.role,
    };
    const refreshToken = this.createRefreshToken({
      payload,
    });
    // update user with refresh token when login
    await this.userService.updateUserToken(user.id, refreshToken);
    // set refresh token to cookie
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge: Number(this.configService.get<string>('JWT_REFRESH_EXPIRE')),
      secure: false,
    });
    // created access token
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
  async processNewToken(refreshToken: string, res: Response) {
    try {
      this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN'),
      });
      const user = await this.userService.findUserByToken(refreshToken);
      if (user) {
        const payload = {
          sub: 'token refresh',
          iss: 'from server',
          id: user.id,
          email: user.email,
          role: user.role,
        };
        const refreshToken = this.createRefreshToken({
          payload,
        });
        // update user with refresh token
        await this.userService.updateUserToken(user.id, refreshToken);

        // set refresh_token to cookie;
        res.cookie('refresh_token', refreshToken, {
          httpOnly: true,
          maxAge: Number(this.configService.get<string>('JWT_REFRESH_EXPIRE')),
          secure: false,
        });
        return {
          access_token: this.jwtService.sign(payload),
          user: {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role,
          },
          message: 'Login successfully',
          status: HttpStatus.OK,
        };
      } else {
        throw new BadRequestException('Invalid refresh token');
      }
    } catch (error) {
      throw new BadRequestException('Invalid refresh token', { cause: error });
    }
  }
  async logout(res: Response, user: IUser) {
    // remove refresh token from user
    await this.userService.updateUserToken(user.id, '');
    // clear cookie
    res.clearCookie('refresh_token');
    return {
      message: 'Logout successfully',
      status: HttpStatus.OK,
    };
  }
  async retryPassword(email: string) {
    return this.userService.retryPassword(email);
  }
  async changePassword(data: ChangePasswordDto) {
    return await this.userService.changePassword(data);
  }
  private createRefreshToken(payload: any) {
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRE'),
    });
    return refreshToken;
  }
}
