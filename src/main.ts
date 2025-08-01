import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { RolesGuard } from './shared/guards/roles.guard';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // cors
  app.enableCors({
    origin: ['http://localhost:3000', 'http://192.168.100.193:3000'],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });
  app.useGlobalGuards(new RolesGuard(app.get(Reflector)));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.use(cookieParser());
  app.setGlobalPrefix('/v1/api', { exclude: ['/'] });
  const configService = app.get(ConfigService);
  await app.listen(configService.get<string>('PORT') ?? 3000);
}
bootstrap().catch((err) => {
  console.error('Error starting the application:', err);
});
