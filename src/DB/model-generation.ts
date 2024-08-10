import { SequelizeModule } from "@nestjs/sequelize";
import { Admin, CompanyCode, CountryCode, Denotion, Product, Report, User } from "./Schemas";

export const models = SequelizeModule.forFeature([User, Admin, Product, Report, Denotion, CountryCode, CompanyCode])
