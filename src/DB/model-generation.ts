// import { MongooseModule } from "@nestjs/mongoose";

import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "./Schemas";

// import { Pending, PendingSchema, User, UserSchema, CodeForgetPassword, CodeForgetPasswordSchema } from './Schemas'

export const models = SequelizeModule.forFeature([User])
