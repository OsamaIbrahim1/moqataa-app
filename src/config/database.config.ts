// src/config/database.config.ts
import { SequelizeModuleOptions } from '@nestjs/sequelize';
import * as env from './app.environments';

export const databaseConfig: SequelizeModuleOptions = {
    dialect: 'mysql',
    host: env.DB_HOST,
    port: env.DB_PORT,
    username: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    models:[],
    autoLoadModels: true,
    synchronize: true,
};
