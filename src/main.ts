import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.use(cookieParser());
  app.setGlobalPrefix('/v1/api', { exclude: ['/'] });
  const configService = app.get(ConfigService);
  await app.listen(configService.get<string>('PORT') ?? 3000);
}
bootstrap().catch((err) => {
  console.error('Error starting the application:', err);
});
