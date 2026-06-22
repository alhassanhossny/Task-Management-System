import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './presentation/filters/http-exception.filter';
import { TransformInterceptor } from './presentation/interceptors/transform.interceptor';
import { I18nMiddleware } from './presentation/middleware/i18n.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://172.16.1.10:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept-Language'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());
  app.use(I18nMiddleware);

  const port = process.env.SERVER_PORT || 3000;
  await app.listen(port, process.env.SERVER_HOST || '0.0.0.0');
  console.log(`TASK Backend running on port ${port}`);
}
bootstrap();
