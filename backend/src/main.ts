import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS
  app.enableCors({
    origin: ['http://localhost:4200'],
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Agua Potable API')
    .setDescription('API para gestión de agua potable comunitaria')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger-ui.html', app, document);
  SwaggerModule.setup('v3/api-docs', app, document);

  const port = parseInt(process.env.PORT || '8081', 10);
  await app.listen(port);
  console.log(`🚀 Backend NestJS corriendo en http://localhost:${port}`);
  console.log(`📖 Swagger: http://localhost:${port}/swagger-ui.html`);
}
bootstrap();
