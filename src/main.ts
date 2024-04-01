import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'dotenv/config';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { LoggerService } from './logger/logger.service';

const PORT = process.env.PORT || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Home Library Service')
    .setDescription('Home library service')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  // app.useGlobalInterceptors(app.get(RequestInterceptor));

  // app.useGlobalFilters

  const logger = app.get(LoggerService);
  app.useLogger(logger);

  await app.listen(PORT);

  process.on('uncaughtException', (error: Error, origin: string) => {
    logger.error(
      `Uncaught exception: ${JSON.stringify(error)}, origin: ${origin}`,
      LoggerService.name,
    );
    process.exit(1);
  });
  process.on(
    'unhandledRejection',
    (reason: Error | unknown, promise: Promise<unknown>) => {
      logger.error(
        `Unhandled rejection, promise: ${JSON.stringify(
          promise,
        )}, reason: ${reason}`,
        LoggerService.name,
      );
    },
  );
  process.on('exit', () => {
    logger.warn('application exited!');
  });
}
bootstrap();
