import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../DB/Schemas';
import * as env from '../config';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        @InjectModel(User)
        private userModel: typeof User,
        private jwtService: JwtService
    ) { }

    async canActivate(
        context: ExecutionContext,
    ): Promise<object> {

        const req = context.switchToHttp().getRequest();
        const { accesstoken } = req.headers;

        if (!accesstoken) {
            throw new BadRequestException(`please login first`)
        }
        if (!accesstoken.startsWith(env.PREFIX_LOGIN_TOKEN)) {
            throw new BadRequestException(`invalid token prefix`);
        }

        const token = accesstoken.split(env.PREFIX_LOGIN_TOKEN)[1];

        const decodedData = this.jwtService.verify(token, { secret: env.SECRET_LOGIN_TOKEN });
        if (!decodedData.id) {
            throw new BadRequestException(`invalid token payload`);
        }

        // check user
        const findUser = await this.userModel.findByPk(decodedData.id, { attributes: ['id', 'email'] });
        if (!findUser) { throw new BadRequestException(`please SignUp first`); }

        // * TokenExpiredError: jwt expired

        req.authUser = findUser

        return req

    }
}