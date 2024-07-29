import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as env from './config'
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './Guards';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }))

  await app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
  });
  
}

bootstrap();