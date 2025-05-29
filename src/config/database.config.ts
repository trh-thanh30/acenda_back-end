import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from 'src/modules/address/entities/address.entity';
import { Booking } from 'src/modules/booking/entities/booking.entity';
import { Hotel } from 'src/modules/hotel/entities/hotel.entity';
import { Review } from 'src/modules/review/entities/review.entity';
import { Room } from 'src/modules/room/entities/room.entity';
import { User } from 'src/modules/users/entities/user.entity';

export const DatabaseConfig = TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    type: 'mysql',
    host: configService.get<string>('HOST_DB'),
    port: configService.get<number>('PORT_DB'),
    username: configService.get<string>('USERNAME_DB'),
    password: configService.get<string>('PASSWORD_DB'),
    database: configService.get<string>('DATABASE_NAME_DB'),
    entities: [User, Address, Hotel, Room, Review, Booking],
    synchronize: true,
  }),
  inject: [ConfigService],
});
