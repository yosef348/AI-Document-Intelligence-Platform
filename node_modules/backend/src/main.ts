import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { ConfigService } from '@nestjs/config';
import type { Config } from './config/configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService<Config, true>>(ConfigService);
  const logger = new Logger('Bootstrap');

  // Global prefix
  app.setGlobalPrefix('api');

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global filters and interceptors
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  // CORS configuration
  const frontendUrl = configService.get('app.frontendUrl', { infer: true });
  app.enableCors({
    origin: frontendUrl || 'http://localhost:3000',
    credentials: true,
  });

  // Swagger setup (development only)
  if (configService.get('app.nodeEnv', { infer: true }) === 'development') {
    const config = new DocumentBuilder()
      .setTitle('AI Document Intelligence API')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  const port = configService.get('app.port', { infer: true }) || 3001;
  await app.listen(port);

  logger.log(`Backend running on http://localhost:${port}`);
  if (configService.get('app.nodeEnv', { infer: true }) === 'development') {
    logger.log(`API docs: http://localhost:${port}/api/docs`);
  }
}

bootstrap();
