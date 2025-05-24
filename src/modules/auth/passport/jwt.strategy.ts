import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IUser } from 'src/modules/users/users.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_TOKEN')!,
    });
  }

  validate(payload: IUser) {
    const {
      email,
      first_name,
      last_name,
      gender,
      id,
      role,
      updated_at,
      created_at,
    } = payload;
    return {
      email,
      first_name,
      last_name,
      gender,
      id,
      role,
      updated_at,
      created_at,
    };
  }
}
