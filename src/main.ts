import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { ValidationException } from './common/exceptions/validation.exception';
import { buildValidationError } from './common/utils/build-validation-error.util';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        const messages = buildValidationError(errors);
        return new ValidationException(messages);
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('TasteBox')
    .setDescription('API Document for TasteBox')
    .setVersion('1.0.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  app.enableCors({
    origin: process.env.FRONTEND_ORIGIN, // 프론트엔드 주소
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
