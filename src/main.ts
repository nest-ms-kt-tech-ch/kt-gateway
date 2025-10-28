import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { RpcCustomExceptionFilter } from './common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger('Main-Gateway');

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new RpcCustomExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('King-tide Tech Challenge Gateway')
    .setDescription('Api gateway for user and movie microservices')
    .setVersion('1.0')
    .addTag('gateway')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory);

  app.enableCors();

  await app.listen(envs.PORT);

  logger.log(`Gateway running on port ${envs.PORT}`);
}
bootstrap();
