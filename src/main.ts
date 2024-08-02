import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { json, NextFunction, Request, Response } from 'express';
import { HttpExceptionFilter } from './Guards';
import helmet from 'helmet';
import * as hpp from 'hpp';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';
import * as csurf from 'csurf';
import * as env from './config'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }))
  app.enableCors({
    methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE'],
    allowedHeaders: ['X-CSRF-Token', 'Content-Type', 'Authorization'],
    credentials: true
  });
  app.use(cookieParser());
  app.use(
    csurf({
      cookie: {
        httpOnly: true,
        secure: true,
        sameSite: 'strict'
      }
    })
  )

  app.use(json({ limit: 'ikb' }));
  app.use(helmet());
  app.use(hpp());
  app.use(compression())
  app.use(express.static('uploads'));
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.cookie('cookie', req.csrfToken());
    next()
  })

  await app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
  });

}

bootstrap();