import { SequelizeModule } from "@nestjs/sequelize";
import { Admin, Product, Report, User } from "./Schemas";

export const models = SequelizeModule.forFeature([User, Admin, Product, Report])
