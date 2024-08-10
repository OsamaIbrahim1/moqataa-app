import { SequelizeModuleOptions } from '@nestjs/sequelize';
import * as env from './app.environments';
import { Admin, CompanyCode, CountryCode, Denotion, Product, Report, User } from '../DB/Schemas';

export const databaseConfig: SequelizeModuleOptions = {
    dialect: 'mysql',
    host: env.DB_HOST,
    port: env.DB_PORT,
    username: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    models: [Admin, User, Product, Report, Denotion,CompanyCode,CountryCode],
    autoLoadModels: true,
    synchronize: true,
}