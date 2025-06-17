/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { ChangePasswordDto, CodeDto } from './dto/code.dto';
import { LocalAuthGuard } from 'src/shared/guards/local-auth.guard';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { Public, User } from 'src/decorator/customize';
import { Request, Response } from 'express';
import { IUser } from '../users/users.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('active')
  activeAccount(@Body() code: CodeDto) {
    return this.authService.activeAccount(code);
  }

  @Public()
  @Post('resend')
  resendCode(@Body('email') email: string) {
    return this.authService.resendCode(email);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(req.user, res);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@User() user: IUser) {
    return this.authService.getProfile(user);
  }

  @Public()
  @Get('refresh')
  refreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = request.cookies['refresh_token'];
    return this.authService.processNewToken(refreshToken, res);
  }
  @Public()
  @Post('retry-password')
  retryPassword(@Body('email') email: string) {
    if (!email) {
      throw new BadRequestException('Email is required');
    }
    return this.authService.retryPassword(email);
  }
  @Public()
  @Post('change-password')
  changePassword(@Body() data: ChangePasswordDto) {
    return this.authService.changePassword(data);
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response, @User() user: IUser) {
    return this.authService.logout(res, user);
  }
}
