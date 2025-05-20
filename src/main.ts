import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/v1/api', { exclude: ['/'] });
  const configService = app.get(ConfigService);
  await app.listen(configService.get<string>('PORT') ?? 3000);
}
bootstrap().catch((err) => {
  console.error('Error starting the application:', err);
});
