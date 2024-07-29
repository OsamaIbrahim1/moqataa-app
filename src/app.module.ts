import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule, AdminModule, ProductModule, ReportModule } from './modules';
import { SequelizeModule } from '@nestjs/sequelize';
import { databaseConfig } from './config';
import { models } from './DB/model-generation';
import { HttpExceptionFilter } from './Guards';
import { APP_FILTER } from '@nestjs/core';


@Module({
  imports: [
    SequelizeModule.forRoot(databaseConfig),
    models,
    UsersModule,
    AdminModule,
    ProductModule,
    ReportModule
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule { }
