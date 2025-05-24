import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
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
    entities: [User],
    synchronize: true,
  }),
  inject: [ConfigService],
});
